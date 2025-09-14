import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('users', {
    id: 'uuid PRIMARY KEY',
    email: { type: 'text', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    name: { type: 'text', notNull: true },
    role: {
      type: 'text',
      notNull: true,
      check: "role IN ('staff', 'manager', 'finance', 'admin')"
    },
    department: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
  });

  pgm.createTable('vendors', {
    id: 'uuid PRIMARY KEY',
    name: { type: 'text', notNull: true },
    email: { type: 'text', notNull: true },
    contact_info: 'text',
    bank_account_no: 'text',
    bank_name: 'text',
    tax_id: 'text',
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
  });

  pgm.createTable('payment_requests', {
    id: 'uuid PRIMARY KEY',
    user_id: { type: 'uuid', references: 'users(id)' },
    vendor_id: { type: 'uuid', references: 'vendors(id)' },
    amount: { type: 'numeric', notNull: true },
    description: 'text',
    department: 'text',
    justification: 'text',
    status: {
      type: 'text',
      notNull: true,
      check: "status IN ('pending', 'processing', 'approved', 'rejected')"
    },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
  });

  pgm.createTable('approvals', {
    id: 'uuid PRIMARY KEY',
    request_id: { type: 'uuid', references: 'payment_requests(id)' },
    approver_id: { type: 'uuid', references: 'users(id)' },
    status: {
      type: 'text',
      notNull: true,
      check: "status IN ('approved', 'rejected')"
    },
    comments: 'text',
    created_at: { type: 'timestamp', default: pgm.func('now()') },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('approvals');
  pgm.dropTable('payment_requests');
  pgm.dropTable('vendors');
  pgm.dropTable('users');
};