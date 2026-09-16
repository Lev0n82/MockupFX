import { PlayerEngine } from '../packages/runtime/dist/index.js';
import { createCsvReport, createStaticBundle, createWordReport } from '../packages/exporter/dist/index.js';
import {
  checkoutProject,
  complexDashboardExpectedState,
  complexDashboardProject,
  expectedCheckoutTraceKinds
} from '../packages/test-fixtures/dist/index.js';

const checkoutEngine = new PlayerEngine(checkoutProject, { trace: true });
const checkoutResult = checkoutEngine.dispatch({ ownerId: 'component_checkout_button', name: 'click' });
if (checkoutResult.error) {
  throw new Error(`Checkout journey failed with ${checkoutResult.error.code}: ${checkoutResult.error.message}`);
}
const expectedCheckoutSnapshot = {
  currentPageId: 'page_confirmation',
  history: ['page_cart'],
  variables: { variable_has_items: true, variable_checkout_count: 1 },
  components: { component_confirmation_message: { visible: true } }
};
assertJson(checkoutResult.snapshot, expectedCheckoutSnapshot, 'checkout snapshot');
assertJson(checkoutResult.trace.map((entry) => entry.kind), expectedCheckoutTraceKinds, 'checkout trace');

const dashboardEngine = new PlayerEngine(complexDashboardProject, { trace: true });
const dashboardResult = dashboardEngine.dispatch({ ownerId: 'component_connect_button', name: 'click' });
if (dashboardResult.error) {
  throw new Error(`Dashboard journey failed with ${dashboardResult.error.code}: ${dashboardResult.error.message}`);
}
assertJson(dashboardResult.snapshot.currentPageId, complexDashboardExpectedState.currentPageId, 'dashboard page');
assertJson(dashboardResult.snapshot.variables, complexDashboardExpectedState.variables, 'dashboard variables');
assertJson(dashboardResult.snapshot.components, complexDashboardExpectedState.components, 'dashboard panel state');

const publicationId = 'self-test-publication';
const staticBundle = await createStaticBundle(complexDashboardProject, {
  publicationId,
  generatedAt: '2026-09-16T12:00:00.000Z',
  bundleBrowserPlayer: async () => 'export function startStandalonePreview() {}'
});
if (!staticBundle.files['index.html'].includes('./player.js') || !staticBundle.manifest.files['player.js']) {
  throw new Error('Static export self-test did not create its offline player package.');
}

const csvReport = createCsvReport(complexDashboardProject, { publicationId });
if (!csvReport.files['variables.csv'].includes('[redacted]') || !csvReport.files['components.csv'].includes('component_connection_panel')) {
  throw new Error('CSV export self-test did not produce the expected safe inventory data.');
}

const wordReport = await createWordReport(complexDashboardProject, { publicationId, generatedAt: '2026-09-16T12:00:00.000Z' });
if (wordReport.bytes[0] !== 0x50 || wordReport.bytes[1] !== 0x4b || !wordReport.entries.includes('word/document.xml')) {
  throw new Error('Word export self-test did not create an OOXML document package.');
}

console.log(`MockupFX self-test passed: checkout ${checkoutResult.processedEvents} events/${checkoutResult.trace.length} trace entries; dashboard ${dashboardResult.processedEvents} events/${dashboardResult.trace.length} trace entries; static, CSV, and DOCX artifacts verified.`);

function assertJson(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Unexpected ${label}: ${JSON.stringify(actual)}`);
  }
}
