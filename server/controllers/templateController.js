import { Template } from "../models/templateModel.js";

// GET /templates/all
export const getTemplatesController = async (req, res) => {
    try {
      const { search = '', myTemplates = 'false', category } = req.query;
  
      let query = {};
      if (category) query.category = category;
      if (myTemplates === 'true') {
        // Only user's templates (no visibility filter)
        query.creator = req.user._id;
      } else {
        // Public templates only
        query.visibility = 'Public';
      }
  
      if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
      }
  
      let templates = await Template.find(query).lean();
  
      if (myTemplates === 'true') {
        templates.forEach(template => {
          template.canEdit = true;
          template.canDelete = true;
        });
      }
  
      return res.status(200).json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      return res.status(500).json({ msg: 'Failed to fetch templates' });
    }
  };
  

// POST /templates/create
export const createTemplateController = async (req, res) => {
  try {
    const { name, description, category, visibility, structure, team } = req.body;

    if (!name || !structure) {
      return res.status(400).json({ msg: 'Name and structure are required' });
    }

    const newTemplate = new Template({
      name,
      description,
      category,
      visibility,
      structure,
      creator: req.user._id,
      team: team || []
    });

    await newTemplate.save();
    return res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    return res.status(500).json({ msg: 'Failed to create template' });
  }
};

// GET /templates/single/:templateId
export const getOneTemplateController = async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await Template.findOne({
      _id: templateId,
      creator: req.user._id
    });

    if (!template) return res.status(404).json({ msg: 'Template not found' });
    return res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return res.status(500).json({ msg: 'Failed to fetch template' });
  }
};

// PUT /templates/single/edit/:templateId
export const editTemplateController = async (req, res) => {
  try {
    const { templateId } = req.params;
    const updates = req.body;

    const updatedTemplate = await Template.findOneAndUpdate(
      { _id: templateId, creator: req.user._id },
      updates,
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ msg: 'Template not found or unauthorized' });
    }

    return res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    return res.status(500).json({ msg: 'Failed to update template' });
  }
};

// DELETE /templates/single/delete/:templateId
export const deleteTemplateController = async (req, res) => {
  try {
    const { templateId } = req.params;

    const deletedTemplate = await Template.findOneAndDelete({
      _id: templateId,
      creator: req.user._id
    });

    if (!deletedTemplate) {
      return res.status(404).json({ msg: 'Template not found or unauthorized' });
    }

    return res.status(200).json({ msg: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return res.status(500).json({ msg: 'Failed to delete template' });
  }
};
