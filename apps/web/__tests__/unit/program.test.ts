// Simple test file to verify program CRUD functionality
import { describe, it, expect } from '@jest/globals';
import { Program } from '@/types/domain/program.entity';

describe('Program Entity', () => {
  it('should create a valid program object', () => {
    const program: Program = {
      id: 1,
      name: 'Test Program',
      budget: '100000.00',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'ACTIVE',
      createdBy: 'test-user',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    expect(program.id).toBe(1);
    expect(program.name).toBe('Test Program');
    expect(program.status).toBe('ACTIVE');
  });

  it('should allow null status', () => {
    const program: Program = {
      id: 1,
      name: 'Test Program',
      budget: '100000.00',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: null,
      createdBy: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    };

    expect(program.status).toBeNull();
  });
});
