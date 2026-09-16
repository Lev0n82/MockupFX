import type { ProjectDocument } from '@mockupfx/format';

export const checkoutProject: ProjectDocument = {
  formatVersion: '0.1.0',
  project: {
    id: 'project_checkout',
    name: 'Checkout confirmation',
    startPageId: 'page_cart'
  },
  pages: [
    { id: 'page_cart', name: 'Cart', rootComponentId: 'component_cart_root' },
    { id: 'page_confirmation', name: 'Confirmation', rootComponentId: 'component_confirmation_root' }
  ],
  components: [
    {
      id: 'component_cart_root',
      pageId: 'page_cart',
      type: 'container',
      visible: true
    },
    {
      id: 'component_checkout_button',
      pageId: 'page_cart',
      type: 'button',
      text: 'Checkout',
      visible: true
    },
    {
      id: 'component_confirmation_root',
      pageId: 'page_confirmation',
      type: 'container',
      visible: true
    },
    {
      id: 'component_confirmation_message',
      pageId: 'page_confirmation',
      type: 'text',
      text: 'Order confirmed',
      visible: false
    }
  ],
  variables: [
    { id: 'variable_has_items', type: 'boolean', initialValue: true },
    { id: 'variable_checkout_count', type: 'number', initialValue: 0 }
  ],
  interactions: [
    {
      id: 'interaction_checkout',
      ownerId: 'component_checkout_button',
      event: 'click',
      branches: [
        {
          id: 'branch_empty_cart',
          enabled: true,
          condition: { type: 'variableEquals', variableId: 'variable_has_items', expected: false },
          actions: [{ id: 'action_empty_text', type: 'setText', componentId: 'component_checkout_button', text: 'Add an item' }]
        },
        {
          id: 'branch_checkout',
          enabled: true,
          condition: { type: 'variableEquals', variableId: 'variable_has_items', expected: true },
          actions: [
            { id: 'action_increment_checkout', type: 'setVariable', variableId: 'variable_checkout_count', value: 1 },
            { id: 'action_go_confirmation', type: 'navigate', pageId: 'page_confirmation', mode: 'push' },
            { id: 'action_emit_confirmation', type: 'emit', ownerId: 'page_confirmation', event: 'entered' }
          ]
        }
      ]
    },
    {
      id: 'interaction_confirmation_entered',
      ownerId: 'page_confirmation',
      event: 'entered',
      branches: [
        {
          id: 'branch_show_confirmation',
          enabled: true,
          condition: { type: 'literal', value: true },
          actions: [
            {
              id: 'action_show_confirmation',
              type: 'setVisibility',
              componentId: 'component_confirmation_message',
              visible: true
            }
          ]
        }
      ]
    }
  ]
};

export const expectedCheckoutTraceKinds = [
  'event-started',
  'branch-evaluated',
  'branch-evaluated',
  'branch-selected',
  'action-completed',
  'action-completed',
  'action-completed',
  'event-committed',
  'event-started',
  'branch-evaluated',
  'branch-selected',
  'action-completed',
  'event-committed'
] as const;
