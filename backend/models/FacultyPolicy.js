const mongoose = require('mongoose');

const FacultyPolicySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

const FacultyPolicy = mongoose.model('FacultyPolicy', FacultyPolicySchema);

// Initial content for the existing Policies & Rules pages.
// Content is seeded only when a record does not already exist.
const seedRows = [
  {
    "key": "training-policy",
    "content": {
      "key": "training-policy",
      "group": "Policies & Rules",
      "title": "Training",
      "accent": "Policy",
      "description": "Supporting continuous learning, professional development and the sharing of knowledge across the institute.",
      "heroImage": "/images/pages-banner.png",
      "heroLeft": "Government Polytechnic",
      "heroRight": "Rohtak (Haryana)",
      "featureKicker": "Professional development",
      "featureTitle": "Learning that strengthens the institution",
      "featureText": "A clear training approach helps faculty and staff keep their knowledge current, strengthen day-to-day skills and respond to changing academic and administrative needs.",
      "featureNumber": "01",
      "sectionEyebrow": "Key focus areas",
      "sectionTitle": "What training can support",
      "sectionText": "The following is an illustrative overview for this redesigned page, not a replacement for the institute’s approved policy document.",
      "cards": [
        {
          "title": "Identify learning needs",
          "text": "Recognise role-based learning needs and areas where additional skills or knowledge can support better performance."
        },
        {
          "title": "Build professional skills",
          "text": "Encourage relevant technical, administrative and digital learning for teaching and support responsibilities."
        },
        {
          "title": "Share knowledge",
          "text": "Support peer learning, orientation and the exchange of useful practices across departments."
        },
        {
          "title": "Review development",
          "text": "Reflect on completed learning and identify suitable next steps for continued professional growth."
        }
      ],
      "processEyebrow": "Useful information",
      "processTitle": "From need to learning",
      "steps": [
        "Understand the training requirement",
        "Identify a suitable programme or learning resource",
        "Participate in the planned learning activity",
        "Review learning outcomes and future needs"
      ],
      "noteTitle": "Official document",
      "noteText": "The original website lists a staff training policy PDF. Add the approved PDF when it is available.",
      "relatedTitle": "Explore another policy",
      "dropdown": [
        {
          "label": "Training policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti sexual harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service rules",
          "url": "/faculty/service-rules"
        }
      ],
      "related": [
        {
          "label": "Training Policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti Ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti Sexual Harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service Rules",
          "url": "/faculty/service-rules"
        }
      ]
    }
  },
  {
    "key": "anti-ragging",
    "content": {
      "key": "anti-ragging",
      "group": "Policies & Rules",
      "title": "Anti",
      "accent": "Ragging",
      "description": "A respectful campus begins with the safety, dignity and wellbeing of every student.",
      "heroImage": "/images/pages-banner.png",
      "heroLeft": "Government Polytechnic",
      "heroRight": "Rohtak (Haryana)",
      "featureKicker": "Zero tolerance for ragging",
      "featureTitle": "Every student deserves to feel safe",
      "featureText": "Ragging has no place in an educational institution. Students are expected to treat one another with respect and help maintain a supportive environment for learning.",
      "featureNumber": "02",
      "sectionEyebrow": "Our campus principles",
      "sectionTitle": "Safety, respect and support",
      "sectionText": "The official page is currently not fully accessible for verification. This section is sample awareness content and should be checked against the institute’s approved anti-ragging policy before publication.",
      "cards": [
        {
          "title": "A safe learning environment",
          "text": "Every student should be able to learn, participate and live on campus without intimidation or humiliation."
        },
        {
          "title": "Respect for everyone",
          "text": "Build a campus culture based on dignity, inclusion and respectful interaction between students."
        },
        {
          "title": "Speak up and seek help",
          "text": "Students who experience or witness ragging should approach an appropriate institute authority or the designated official channel."
        }
      ],
      "processEyebrow": "Useful information",
      "processTitle": "Help keep the campus welcoming",
      "steps": [
        "Treat fellow students with dignity and respect",
        "Do not encourage, participate in or promote ragging",
        "Seek help promptly if a student may be at risk",
        "Cooperate with the institute’s authorised response process"
      ],
      "noteTitle": "Important before publication",
      "noteText": "This page includes a demonstration complaint form only. Connect an approved secure complaint-handling system before accepting real reports.",
      "relatedTitle": "Explore another policy",
      "dropdown": [
        {
          "label": "Training policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti sexual harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service rules",
          "url": "/faculty/service-rules"
        }
      ],
      "related": [
        {
          "label": "Training Policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti Ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti Sexual Harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service Rules",
          "url": "/faculty/service-rules"
        }
      ]
    }
  },
  {
    "key": "anti-sexual-harassment",
    "content": {
      "key": "anti-sexual-harassment",
      "group": "Policies & Rules",
      "title": "Anti Sexual",
      "accent": "Harassment",
      "description": "Promoting dignity, respect and a safe environment for everyone at the institute.",
      "heroImage": "/images/pages-banner.png",
      "heroLeft": "Government Polytechnic",
      "heroRight": "Rohtak (Haryana)",
      "featureKicker": "Respect and dignity",
      "featureTitle": "A campus where everyone is treated with respect",
      "featureText": "The institute’s published information says employees and students have the right to be treated with dignity, and that concerns should receive prompt attention.",
      "featureNumber": "03",
      "sectionEyebrow": "Policy commitments",
      "sectionTitle": "What the published policy highlights",
      "sectionText": "These points summarise the information available on the institute’s official page.",
      "cards": [
        {
          "title": "A respectful workplace",
          "text": "The institute’s published policy describes dignity and respectful treatment as an important right for employees and students."
        },
        {
          "title": "Confidential handling",
          "text": "Concerns should be handled sensitively, with care for the privacy and dignity of the people involved."
        },
        {
          "title": "A committee-led process",
          "text": "The official page refers to a committee for addressing complaints. Current membership and contact details should be confirmed by the institute."
        },
        {
          "title": "Timely attention",
          "text": "The published information states that complaints should receive prompt attention and appropriate action."
        }
      ],
      "processEyebrow": "Useful information",
      "processTitle": "How to raise a concern",
      "steps": [
        "Reach out through an authorised institute channel",
        "Share the concern with the designated committee or authority",
        "Allow the authorised process to review the matter",
        "Follow the official guidance communicated by the institute"
      ],
      "noteTitle": "Important before publication",
      "noteText": "The official page refers to a committee, but its current membership and contact details must be verified. Connect an approved secure complaint-handling system before collecting real complaints.",
      "relatedTitle": "Explore another policy",
      "dropdown": [
        {
          "label": "Training policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti sexual harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service rules",
          "url": "/faculty/service-rules"
        }
      ],
      "related": [
        {
          "label": "Training Policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti Ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti Sexual Harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service Rules",
          "url": "/faculty/service-rules"
        }
      ]
    }
  },
  {
    "key": "service-rules",
    "content": {
      "key": "service-rules",
      "group": "Policies & Rules",
      "title": "Service",
      "accent": "Rules",
      "description": "Reference information for understanding the service rules and government instructions applicable to institute employees.",
      "heroImage": "/images/pages-banner.png",
      "heroLeft": "Government Polytechnic",
      "heroRight": "Rohtak (Haryana)",
      "featureKicker": "Official framework",
      "featureTitle": "Refer to the rules that apply to your service",
      "featureText": "The institute’s website links to Haryana Government service rules. The applicable provisions may depend on the employee’s post, service group and subsequent government amendments.",
      "featureNumber": "04",
      "sectionEyebrow": "Reference areas",
      "sectionTitle": "Common service-rule topics",
      "sectionText": "This is a general navigation summary prepared for the redesigned page. It does not reproduce or replace the official rules.",
      "cards": [
        {
          "title": "Service conditions",
          "text": "Conditions of service are governed by the applicable Haryana Government rules, notifications and orders for the relevant employee category."
        },
        {
          "title": "Roles and responsibilities",
          "text": "Employees are expected to carry out assigned duties professionally and follow the institute’s applicable administrative procedures."
        },
        {
          "title": "Leave and attendance",
          "text": "Leave, attendance and related matters are handled under the rules and instructions applicable to the employee’s post and service category."
        },
        {
          "title": "Official amendments",
          "text": "Updates and clarifications should be taken from the latest government notifications and competent authority instructions."
        }
      ],
      "processEyebrow": "Useful information",
      "processTitle": "Useful checks",
      "steps": [
        "Check the rule set applicable to the employee’s post and service category",
        "Refer to the latest government notification or amendment",
        "Confirm interpretation with the competent administrative authority"
      ],
      "noteTitle": "Official document and amendments",
      "noteText": "Add the verified Haryana Government service rules document and current amendments once their exact official URLs and applicability are confirmed.",
      "relatedTitle": "Explore another policy",
      "dropdown": [
        {
          "label": "Training policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti sexual harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service rules",
          "url": "/faculty/service-rules"
        }
      ],
      "related": [
        {
          "label": "Training Policy",
          "url": "/faculty/training-policy"
        },
        {
          "label": "Anti Ragging",
          "url": "/faculty/anti-ragging"
        },
        {
          "label": "Anti Sexual Harassment",
          "url": "/faculty/anti-sexual-harassment"
        },
        {
          "label": "Service Rules",
          "url": "/faculty/service-rules"
        }
      ]
    }
  }
];

FacultyPolicy.seed = async function () {
  for (const row of seedRows) {
    await this.updateOne(
      { key: row.key },
      { $setOnInsert: { content: row.content } },
      { upsert: true }
    );
  }
};

module.exports = FacultyPolicy;
