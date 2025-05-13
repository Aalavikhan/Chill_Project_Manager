import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../app.js';
import { Template } from '../models/templateModel.js';


vi.mock('../models/templateModel.js');


vi.mock('../middlewares/authMiddleware.js', () => ({
  authenticate: (req, res, next) => {
    req.user = { _id: 'user123' };
    next();
  }
}));

describe('POST /api/templates/create - createTemplateController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if name or structure is missing', async () => {
    const res = await request(app)
      .post('/api/templates/create')
      .send({ name: 'Template without structure' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ msg: 'Name and structure are required' });
  });

  it('should create and return a new template (with all fields)', async () => {
    const mockTemplateData = {
      name: 'New Template',
      description: 'Some description',
      category: 'Design',
      visibility: 'Public',
      structure: { tasks: [] },
      team: ['team1', 'team2']
    };

    const mockSavedTemplate = {
      ...mockTemplateData,
      creator: 'user123',
      save: vi.fn().mockResolvedValue(true)
    };

    Template.mockImplementation(() => mockSavedTemplate);

    const res = await request(app)
      .post('/api/templates/create')
      .send(mockTemplateData);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      ...mockTemplateData,
      creator: 'user123'
    });
    expect(mockSavedTemplate.save).toHaveBeenCalled();
  });

  it('should create template with default values for missing optional fields', async () => {
    const minimalData = {
      name: 'Minimal',
      structure: { tasks: [] }
    };

    const mockSavedTemplate = {
      ...minimalData,
      creator: 'user123',
      team: [],
      save: vi.fn().mockResolvedValue(true)
    };

    Template.mockImplementation(() => mockSavedTemplate);

    const res = await request(app)
      .post('/api/templates/create')
      .send(minimalData);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Minimal');
    expect(res.body.creator).toBe('user123');
    expect(res.body.team).toEqual([]);
    expect(mockSavedTemplate.save).toHaveBeenCalled();
  });

  it('should return 500 if save throws an error', async () => {
    Template.mockImplementation(() => ({
      save: vi.fn().mockRejectedValue(new Error('DB Save Error'))
    }));

    const res = await request(app)
      .post('/api/templates/create')
      .send({ name: 'Bad Save', structure: { tasks: [] } });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ msg: 'Failed to create template' });
  });
});
