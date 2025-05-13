import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['Development', 'Marketing', 'Design', 'HR', 'General', 'Other'],
      default: 'General'
    },
    visibility: {
      type: String,
      enum: ['Private', 'Public'],
      default: 'Private' 
    },
    
    structure: {
      tasks: [{
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          default: 'Medium'
        },
        status: {
          type: String,
          enum: ['To Do', 'In Progress', 'Review', 'Complete'],
          default: 'To Do'
        },
        estimatedHours: Number,
        tags: [String],
        
        assigneeType: {
          type: String,
          enum: ['Project Manager', 'Developer', 'Designer', 'Tester', 'Unassigned'],
          default: 'Unassigned'
        },
        subtasks: [{
          title: String,
          description: String
        }]
      }]

    }, 
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    team:  [
        {
                  type: Schema.Types.ObjectId,
                    ref: 'Team'
        }
    ]
  }, {
    timestamps: true
  });

export const Template = mongoose.model("Template", TemplateSchema);