const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['lead_created', 'lead_updated', 'lead_converted', 'customer_created',
             'task_created', 'task_completed', 'note_added', 'email_sent'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    relatedTo: {
      modelType: {
        type: String,
        enum: ['Lead', 'Customer', 'Task'],
      },
      modelId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedTo.modelType',
      },
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
