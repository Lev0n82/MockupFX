import { PlayerEngine } from '../packages/runtime/dist/index.js';
import { checkoutProject, expectedCheckoutTraceKinds } from '../packages/test-fixtures/dist/index.js';

const engine = new PlayerEngine(checkoutProject, { trace: true });
const result = engine.dispatch({ ownerId: 'component_checkout_button', name: 'click' });

if (result.error) {
  throw new Error(`Reference journey failed with ${result.error.code}: ${result.error.message}`);
}

const expectedSnapshot = {
  currentPageId: 'page_confirmation',
  history: ['page_cart'],
  variables: { variable_has_items: true, variable_checkout_count: 1 },
  components: { component_confirmation_message: { visible: true } }
};

if (JSON.stringify(result.snapshot) !== JSON.stringify(expectedSnapshot)) {
  throw new Error(`Unexpected snapshot: ${JSON.stringify(result.snapshot)}`);
}

const traceKinds = result.trace.map((entry) => entry.kind);
if (JSON.stringify(traceKinds) !== JSON.stringify(expectedCheckoutTraceKinds)) {
  throw new Error(`Unexpected trace: ${JSON.stringify(traceKinds)}`);
}

console.log(`MockupFX player self-test passed: ${result.processedEvents} events, ${result.trace.length} trace entries.`);
