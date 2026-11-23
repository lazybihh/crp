const mongoose = require('mongoose');

const FacultyServiceSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

const FacultyService = mongoose.model('FacultyService', FacultyServiceSchema);

// Initial content for the existing Services pages.
// Content is seeded only when a record does not already exist.
const seedRows = [
  {
    "key": "iqac",
    "content": {
      "key": "iqac",
      "group": "Services",
      "title": "Internal Quality",
      "accent": "Assurance Cell",
      "description": "A focus on reviewing institutional practices, encouraging feedback and supporting continuous improvement.",
      "heroImage": "/images/pages-banner.png",
      "heroLeft": "Government Polytechnic",
      "heroRight": "Rohtak (Haryana)",
      "featureKicker": "Official website information",
      "featureTitle": "Quality assurance at the institute",
      "featureText": "The institute’s IQAC page states that AICTE parameters under the Internal Quality Assurance Cell have been evaluated and implemented. This page presents that information in a clearer format.",
      "featureNumber": "01",
      "sectionEyebrow": "Illustrative framework",
      "sectionTitle": "Areas that support quality",
      "sectionText": "The following themes are sample presentation content, not a published list of official IQAC activities.",
      "cards": [
        {
          "title": "Academic quality",
          "text": "Encourage thoughtful review of teaching, learning resources and academic practices."
        },
        {
          "title": "Stakeholder feedback",
          "text": "Use feedback from students, faculty and other stakeholders to identify areas for improvement."
        },
        {
          "title": "Review and documentation",
          "text": "Keep quality-related activities, observations and improvement actions organised."
        },
        {
          "title": "Continuous improvement",
          "text": "Review outcomes and identify practical steps that can strengthen institutional processes."
        }
      ],
      "processEyebrow": "Useful information",
      "processTitle": "",
      "steps": [],
      "noteTitle": "Content note",
      "noteText": "The live IQAC page provides only a brief statement and does not publish committee members, meeting minutes, annual reports or contact details. Add verified documents when the institute provides them.",
      "relatedTitle": "Explore faculty services",
      "dropdown": [
        {
          "label": "IQAC",
          "url": "/faculty/iqac"
        },
        {
          "label": "HRMS",
          "url": "https://intrahry.gov.in",
          "external": true
        },
        {
          "label": "E-services",
          "url": "/faculty/e-services"
        }
      ],
      "related": [
        {
          "label": "IQAC",
          "url": "/faculty/iqac"
        },
        {
          "label": "E-services",
          "url": "/faculty/e-services"
        }
      ]
    }
  },
  {
    "key": "e-services",
    "content": {
      "key": "e-services",
      "group": "Services",
      "title": "Faculty",
      "accent": "E-services",
      "description": "Quick access to the online services listed for faculty and staff by Chhotu Ram Polytechnic.",
      "heroImage": "/images/pages-banner.png",
      "heroLeft": "Government Polytechnic",
      "heroRight": "Rohtak (Haryana)",
      "featureKicker": "Available services",
      "featureTitle": "Choose a service",
      "featureText": "The official page lists the following two services. Destination links are not published there, so no unverified links have been added.",
      "featureNumber": "02",
      "sectionEyebrow": "Available services",
      "sectionTitle": "Services listed by the institute",
      "sectionText": "These are the two services named on the existing Faculty E-Services page.",
      "cards": [
        {
          "title": "CDTP",
          "text": "The official Faculty E-Services page lists CDTP as an available service."
        },
        {
          "title": "Apprenticeship",
          "text": "The official Faculty E-Services page also lists Apprenticeship."
        }
      ],
      "processEyebrow": "Useful information",
      "processTitle": "",
      "steps": [],
      "noteTitle": "Need a direct link?",
      "noteText": "Ask the institute to confirm the correct CDTP and Apprenticeship portal URLs before publishing external buttons.",
      "relatedTitle": "Explore faculty services",
      "dropdown": [
        {
          "label": "IQAC",
          "url": "/faculty/iqac"
        },
        {
          "label": "HRMS",
          "url": "https://intrahry.gov.in",
          "external": true
        },
        {
          "label": "E-services",
          "url": "/faculty/e-services"
        }
      ],
      "related": [
        {
          "label": "IQAC",
          "url": "/faculty/iqac"
        },
        {
          "label": "E-services",
          "url": "/faculty/e-services"
        }
      ]
    }
  }
];

FacultyService.seed = async function () {
  for (const row of seedRows) {
    await this.updateOne(
      { key: row.key },
      { $setOnInsert: { content: row.content } },
      { upsert: true }
    );
  }
};

module.exports = FacultyService;
