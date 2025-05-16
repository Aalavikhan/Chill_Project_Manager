import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getTemplatesController } from '../controllers/templateController.js';
import { Template } from '../models/templateModel.js';

vi.mock('../models/Template');

const app = express();
app.use(bodyParser.json());

// Mock user middleware
app.use((req, res, next) => {
  req.user = { _id: 'user123' };
  next();
});

app.get('/templates', getTemplatesController);

describe('GET /templates - getTemplatesController', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(Template, 'find');
    });
  
    it('should return public templates by default', async () => {
      const mockTemplates = [
        { name: 'Public Template', visibility: 'Public' }
      ];
  
      Template.find.mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockTemplates)
      });
  
      const res = await request(app).get('/templates');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTemplates);
      expect(Template.find).toHaveBeenCalledWith({
        visibility: 'Public'
      });
    });
  
    it('should return user\'s templates with canEdit and canDelete if myTemplates=true', async () => {
      const userTemplates = [
        { name: 'User Template 1', creator: 'user123' },
        { name: 'User Template 2', creator: 'user123' }
      ];
  
      Template.find.mockReturnValue({
        lean: vi.fn().mockResolvedValue(userTemplates)
      });
  
      const res = await request(app).get('/templates?myTemplates=true');
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('canEdit', true);
      expect(res.body[0]).toHaveProperty('canDelete', true);
      expect(Template.find).toHaveBeenCalledWith({
        creator: 'user123'
      });
    });
  
    it('should filter by category and search term', async () => {
      const filteredTemplates = [
        { name: 'HR Onboarding', category: 'HR', visibility: 'Public' }
      ];
  
      Template.find.mockReturnValue({
        lean: vi.fn().mockResolvedValue(filteredTemplates)
      });
  
      const res = await request(app).get('/templates?category=HR&search=onboard');
  
      expect(res.status).toBe(200);
      expect(Template.find).toHaveBeenCalledWith({
        visibility: 'Public',
        category: 'HR',
        name: { $regex: 'onboard', $options: 'i' }
      });
      expect(res.body[0].category).toBe('HR');
    });
  
    it('should return 500 if database throws an error', async () => {
      Template.find.mockImplementation(() => {
        throw new Error('DB Error');
      });
  
      const res = await request(app).get('/templates');
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ msg: 'Failed to fetch templates' });
    });
  });
  