import type { ProjectDocument } from '@mockupfx/format';

export const complexDashboardProject: ProjectDocument = {
  formatVersion: '0.1.0',
  project: {
    id: 'project_operations_dashboard',
    name: 'Operations dashboard',
    startPageId: 'page_dashboard'
  },
  pages: [
    { id: 'page_dashboard', name: 'Dashboard', rootComponentId: 'component_dashboard_root' },
    { id: 'page_details', name: 'Connection details', rootComponentId: 'component_details_root' }
  ],
  components: [
    {
      id: 'component_dashboard_root',
      pageId: 'page_dashboard',
      type: 'container',
      name: 'Dashboard canvas',
      visible: true,
      bounds: { x: 0, y: 0, width: 1024, height: 720 },
      style: { backgroundColor: '#f8fafc', padding: 24 }
    },
    {
      id: 'component_status_master',
      pageId: 'page_dashboard',
      type: 'master',
      name: 'Connection status master',
      parentComponentId: 'component_dashboard_root',
      ariaLabel: 'Connection status',
      visible: true,
      bounds: { x: 24, y: 24, width: 460, height: 240 },
      style: { backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 12, padding: 20 }
    },
    {
      id: 'component_status_heading',
      pageId: 'page_dashboard',
      type: 'text',
      name: 'Connection heading',
      parentComponentId: 'component_status_master',
      text: 'Workspace connection',
      visible: true,
      bounds: { x: 20, y: 18, width: 360, height: 28 },
      style: { color: '#0f172a', fontSize: 20, fontWeight: 'bold' }
    },
    {
      id: 'component_status_badge',
      pageId: 'page_dashboard',
      type: 'text',
      name: 'Connection badge',
      parentComponentId: 'component_status_master',
      text: 'Disconnected',
      visible: true,
      bounds: { x: 20, y: 58, width: 200, height: 22 },
      style: { color: '#b91c1c', fontWeight: 'semibold' }
    },
    {
      id: 'component_connection_panel',
      pageId: 'page_dashboard',
      type: 'dynamicPanel',
      name: 'Connection panel',
      parentComponentId: 'component_status_master',
      ariaLabel: 'Connection status panel',
      panelStates: [
        { id: 'state_offline', name: 'Offline' },
        { id: 'state_online', name: 'Online' }
      ],
      initialPanelStateId: 'state_offline',
      visible: true,
      bounds: { x: 20, y: 92, width: 420, height: 120 },
      style: { backgroundColor: '#eff6ff', borderRadius: 8, padding: 16 }
    },
    {
      id: 'component_connection_offline_text',
      pageId: 'page_dashboard',
      type: 'text',
      name: 'Offline message',
      parentComponentId: 'component_connection_panel',
      panelStateId: 'state_offline',
      text: 'No service connection is active.',
      visible: true,
      bounds: { x: 16, y: 14, width: 280, height: 22 },
      style: { color: '#334155' }
    },
    {
      id: 'component_connect_button',
      pageId: 'page_dashboard',
      type: 'button',
      name: 'Connect service button',
      parentComponentId: 'component_connection_panel',
      panelStateId: 'state_offline',
      text: 'Connect service',
      ariaLabel: 'Connect service',
      visible: true,
      bounds: { x: 16, y: 52, width: 160, height: 40 },
      style: { backgroundColor: '#1d4ed8', color: '#ffffff', borderRadius: 6, fontWeight: 'bold' }
    },
    {
      id: 'component_connection_online_text',
      pageId: 'page_dashboard',
      type: 'text',
      name: 'Online message',
      parentComponentId: 'component_connection_panel',
      panelStateId: 'state_online',
      text: 'Service connected and synchronizing.',
      visible: true,
      bounds: { x: 16, y: 14, width: 300, height: 22 },
      style: { color: '#166534' }
    },
    {
      id: 'component_view_details_button',
      pageId: 'page_dashboard',
      type: 'button',
      name: 'View connection details button',
      parentComponentId: 'component_connection_panel',
      panelStateId: 'state_online',
      text: 'View details',
      ariaLabel: 'View connection details',
      visible: true,
      bounds: { x: 16, y: 52, width: 140, height: 40 },
      style: { backgroundColor: '#166534', color: '#ffffff', borderRadius: 6, fontWeight: 'bold' }
    },
    {
      id: 'component_details_root',
      pageId: 'page_details',
      type: 'container',
      name: 'Details canvas',
      visible: true,
      bounds: { x: 0, y: 0, width: 1024, height: 720 },
      style: { backgroundColor: '#f8fafc', padding: 24 }
    },
    {
      id: 'component_details_heading',
      pageId: 'page_details',
      type: 'text',
      name: 'Details heading',
      parentComponentId: 'component_details_root',
      text: 'Connection details',
      visible: true,
      bounds: { x: 24, y: 24, width: 300, height: 32 },
      style: { color: '#0f172a', fontSize: 24, fontWeight: 'bold' }
    },
    {
      id: 'component_api_key',
      pageId: 'page_details',
      type: 'input',
      name: 'API key input',
      parentComponentId: 'component_details_root',
      ariaLabel: 'API key',
      value: '',
      visible: true,
      bounds: { x: 24, y: 76, width: 360, height: 40 },
      style: { borderColor: '#94a3b8', borderRadius: 6, padding: 8 }
    },
    {
      id: 'component_sync_enabled',
      pageId: 'page_details',
      type: 'checkbox',
      name: 'Automatic synchronization checkbox',
      parentComponentId: 'component_details_root',
      ariaLabel: 'Enable automatic synchronization',
      text: 'Enable automatic synchronization',
      visible: true,
      bounds: { x: 24, y: 134, width: 320, height: 28 },
      style: { color: '#0f172a' }
    }
  ],
  variables: [
    { id: 'variable_connected', type: 'boolean', initialValue: false },
    { id: 'variable_connection_label', type: 'string', initialValue: 'Disconnected' }
  ],
  interactions: [
    {
      id: 'interaction_connect_service',
      ownerId: 'component_connect_button',
      event: 'click',
      branches: [
        {
          id: 'branch_connect_service',
          enabled: true,
          condition: { type: 'variableEquals', variableId: 'variable_connected', expected: false },
          actions: [
            { id: 'action_set_connected', type: 'setVariable', variableId: 'variable_connected', value: true },
            { id: 'action_set_connection_label', type: 'setVariable', variableId: 'variable_connection_label', value: 'Connected' },
            { id: 'action_show_online', type: 'setPanelState', componentId: 'component_connection_panel', stateId: 'state_online' },
            { id: 'action_emit_connected', type: 'emit', ownerId: 'component_status_master', event: 'connectionChanged' }
          ]
        }
      ]
    },
    {
      id: 'interaction_connection_changed',
      ownerId: 'component_status_master',
      event: 'connectionChanged',
      branches: [
        {
          id: 'branch_connection_changed',
          enabled: true,
          condition: { type: 'variableEquals', variableId: 'variable_connected', expected: true },
          actions: [
            { id: 'action_set_badge', type: 'setText', componentId: 'component_status_badge', text: 'Connected' }
          ]
        }
      ]
    },
    {
      id: 'interaction_view_details',
      ownerId: 'component_view_details_button',
      event: 'click',
      branches: [
        {
          id: 'branch_view_details',
          enabled: true,
          condition: { type: 'variableEquals', variableId: 'variable_connected', expected: true },
          actions: [
            { id: 'action_navigate_details', type: 'navigate', pageId: 'page_details', mode: 'push' }
          ]
        }
      ]
    }
  ]
};

export const complexDashboardExpectedState = {
  currentPageId: 'page_dashboard',
  variables: { variable_connected: true, variable_connection_label: 'Connected' },
  components: {
    component_connection_panel: { panelStateId: 'state_online' },
    component_status_badge: { text: 'Connected' }
  }
} as const;
