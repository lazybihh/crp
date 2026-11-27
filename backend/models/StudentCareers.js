const mongoose = require("mongoose");
const Schema = new mongoose.Schema({ key: { type: String, required: true, unique: true }, content: { type: mongoose.Schema.Types.Mixed, required: true } }, { timestamps: true });
const Model = mongoose.model("StudentCareers", Schema);
const seedRows = [
  {
    "key": "skill-courses",
    "content": {
      "hero": {
        "image": "/images/campus-2.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Skill courses",
        "lead": "Practical programmes that add skills to your diploma. The institute currently lists two of them: CDTP and Apprenticeship."
      },
      "programmes": [
        {
          "id": "cdtp",
          "name": "CDTP",
          "full": "Community Development through Polytechnics",
          "status": "Details coming soon",
          "text": "A skill programme run by the institute. The course list, duration and dates will be added here as soon as the institute publishes them."
        },
        {
          "id": "apprenticeship",
          "name": "Apprenticeship",
          "full": "Training for ITI certificate holders",
          "status": "Full details inside",
          "text": "Hands-on training offered every year to ITI certificate holders in trades such as electrical installation, computer operation, plumbing and welding.",
          "to": "/students/apprenticeship"
        }
      ],
      "why": [
        {
          "title": "Learn by doing",
          "text": "Skill programmes focus on practical work, so you practise what you learn."
        },
        {
          "title": "Build job-ready skills",
          "text": "Add skills that employers look for next to your diploma."
        },
        {
          "title": "Grow beyond the syllabus",
          "text": "Explore a trade or topic that your regular classes do not cover."
        }
      ],
      "related": [
        {
          "label": "Apprenticeship",
          "text": "Training places for ITI certificate holders.",
          "to": "/students/apprenticeship"
        },
        {
          "label": "Online learning portals",
          "text": "Free national and board courses to study alongside.",
          "to": "/students/online-learning"
        },
        {
          "label": "Freelancing",
          "text": "Turn a skill into projects of your own.",
          "to": "/students/freelancing"
        }
      ],
      "key": "skill-courses"
    }
  },
  {
    "key": "freelancing",
    "content": {
      "hero": {
        "image": "/images/campus-3.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Freelancing"
      },
      "guide": [
        {
          "goal": "Learn a practical skill",
          "name": "Skill courses",
          "to": "/students/skill-courses"
        },
        {
          "goal": "Study online, free of cost",
          "name": "Online learning portals",
          "to": "/students/online-learning"
        },
        {
          "goal": "Ask a question",
          "name": "Student helpline",
          "to": "/students/helpline"
        }
      ],
      "meaning": [
        {
          "title": "Work on your own terms",
          "text": "A freelancer is not tied to one employer. You choose when and how you work."
        },
        {
          "title": "Take on projects",
          "text": "You do a piece of work for a client, deliver it, and then move to the next one."
        },
        {
          "title": "Earn from your skills",
          "text": "The better your skill, the more work you can offer, so a diploma skill can become a source of income."
        }
      ],
      "steps": [
        {
          "title": "Pick one skill",
          "text": "Choose a single skill you enjoy, such as drafting, programming, electrical work or repair, and get good at it."
        },
        {
          "title": "Build a small portfolio",
          "text": "Keep photos, files or links of your best work in one place, so a client can see what you can do."
        },
        {
          "title": "Start with a small project",
          "text": "Offer your skill to someone you know. A small first job teaches more than any plan."
        }
      ],
      "related": [
        {
          "label": "Skill courses",
          "text": "Practical programmes to build your skills.",
          "to": "/students/skill-courses"
        },
        {
          "label": "Incubator",
          "text": "Taking an idea further than a single project.",
          "to": "/students/incubator"
        },
        {
          "label": "Entrepreneurship",
          "text": "Stories and support for student entrepreneurs.",
          "to": "/about/entrepreneurship"
        }
      ],
      "key": "freelancing"
    }
  },
  {
    "key": "incubator",
    "content": {
      "hero": {
        "image": "/images/campus-workshop.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Incubator",
        "lead": "A place where a student idea can grow into something real. The institute is preparing its incubator details - this page shows what an incubator is and where to begin."
      },
      "journey": [
        {
          "title": "Idea",
          "text": "Spot a problem worth solving."
        },
        {
          "title": "Plan",
          "text": "Decide who it is for and how it works."
        },
        {
          "title": "Build",
          "text": "Make a first working version."
        },
        {
          "title": "Launch",
          "text": "Put it in front of real users."
        }
      ],
      "offers": [
        {
          "title": "Mentoring",
          "text": "Guidance from people who have built things before."
        },
        {
          "title": "Workspace",
          "text": "A place to meet, plan and build with your team."
        },
        {
          "title": "Networking",
          "text": "Introductions to experts, other founders and possible customers."
        },
        {
          "title": "Direction",
          "text": "Help with the next step, from a first prototype to a first customer."
        }
      ],
      "related": [
        {
          "label": "Entrepreneurship",
          "text": "Stories and support for student entrepreneurs.",
          "to": "/about/entrepreneurship"
        },
        {
          "label": "Student projects",
          "text": "See what students at the institute have built.",
          "to": "/about/projects"
        },
        {
          "label": "Freelancing",
          "text": "Turn a skill into projects of your own.",
          "to": "/students/freelancing"
        }
      ],
      "key": "incubator"
    }
  },
  {
    "key": "apprenticeship",
    "content": {
      "hero": {
        "image": "/images/campus-2.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Apprenticeship",
        "lead": "Every year the institute offers hands-on training to ITI certificate holders in technical trades. Here is who it is for and what it covers."
      },
      "session": {
        "count": 2,
        "interns": [
          {
            "trade": "Computer operation and programme application"
          },
          {
            "trade": "Electrical installation and management"
          }
        ]
      },
      "trades": [
        {
          "name": "Instrument repair"
        },
        {
          "name": "Electrical installation and management"
        },
        {
          "name": "Computer operation"
        },
        {
          "name": "Plumbing"
        },
        {
          "name": "Welding"
        },
        {
          "name": "Other skill-based technical work"
        }
      ],
      "faqs": [
        {
          "q": "Who can do an apprenticeship at the institute?",
          "a": "ITI certificate holders. The institute offers training places to them every year."
        },
        {
          "q": "Which trades are covered?",
          "a": "Instrument repair, electrical installation and management, computer operation, plumbing, welding and other skill-based technical work."
        },
        {
          "q": "How many interns are training now?",
          "a": "Two this session: one in computer operation and programme application, and one in electrical installation and management. Both are ITI certificate holders."
        },
        {
          "q": "How do I ask about a place?",
          "a": "Call or write to the institute office. The contact details are at the bottom of this page."
        }
      ],
      "related": [
        {
          "label": "Skill courses",
          "text": "Other practical programmes at the institute.",
          "to": "/students/skill-courses"
        },
        {
          "label": "Admissions",
          "text": "Diploma programmes, seats and how to apply.",
          "to": "/students/admissions"
        },
        {
          "label": "Placements",
          "text": "Where our students go after training.",
          "to": "/about/placements"
        }
      ],
      "key": "apprenticeship"
    }
  },
  {
    "key": "ncc-nss",
    "content": {
      "hero": {
        "image": "/images/campus-3.jpg"
      },
      "photo": {
        "src": "/images/ncc/ncc-activity.jpg",
        "alt": "NCC cadets taking part in an activity at the institute"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "NCC & NSS",
        "lead": "The National Cadet Corps builds discipline, leadership and a spirit of service. Read how it works at the institute, who can join and what cadets can earn."
      },
      "about": [
        "The National Cadet Corps was instituted in 1949 and is the largest youth organisation in the world. Its motto is Unity & Discipline.",
        "At the institute, a Senior Division (Army Wing) platoon of 52 cadets trains under 8 Haryana Battalion NCC, Rewari. Training runs from July to March each year for three years and covers institutional and camp training, community development and social service, adventure training and sports, a youth exchange programme, career counselling and a certificate examination."
      ],
      "facts": [
        {
          "label": "Instituted",
          "value": "1949"
        },
        {
          "label": "Motto",
          "value": "Unity & Discipline"
        },
        {
          "label": "Wing at the institute",
          "value": "Senior Division (Army Wing)"
        },
        {
          "label": "Battalion",
          "value": "8 Haryana Battalion NCC, Rewari"
        }
      ],
      "eligibility": [
        "A citizen of India or a subject of Nepal",
        "Enrolled in an educational institution",
        "Of good moral character",
        "Meets the prescribed medical standards"
      ],
      "docs": [
        {
          "id": "about",
          "title": "About NCC",
          "text": "The motto, aim and core values, the cadet commandments and pledge, and how NCC training runs at the institute.",
          "href": "/docs/ncc/about-ncc.pdf",
          "type": "PDF"
        },
        {
          "id": "join",
          "title": "How to join NCC",
          "text": "Who can join, how to apply, verification, the medical examination and enrolment.",
          "href": "/docs/ncc/how-to-join-ncc.pdf",
          "type": "PDF"
        },
        {
          "id": "exam",
          "title": "Eligibility for the certificate examination",
          "text": "The rules for the NCC 'B' and 'C' certificate examinations, and for a retest to improve a 'C' grade.",
          "href": "/docs/ncc/certificate-exam-eligibility.pdf",
          "type": "PDF"
        },
        {
          "id": "incentives",
          "title": "Incentives to cadets",
          "text": "Employment opportunities, scholarships and awards that the Central and State Governments offer to cadets.",
          "href": "/docs/ncc/incentives-to-cadets.pdf",
          "type": "PDF"
        }
      ],
      "scholarships": {
        "title": "Awards and scholarships",
        "text": "Scholarship details, 2021-22.",
        "href": "/docs/ncc/scholarship-details-2021-22.docx",
        "type": "DOCX"
      },
      "related": [
        {
          "label": "Extracurricular achievements",
          "text": "Sports, cultural and other wins by our students.",
          "to": "/about/extracurricular"
        },
        {
          "label": "Facilities",
          "text": "Hostels, labs, sports and the rest of the campus.",
          "to": "/about/facilities"
        },
        {
          "label": "Skill courses",
          "text": "Practical programmes alongside your diploma.",
          "to": "/students/skill-courses"
        }
      ],
      "key": "ncc-nss"
    }
  }
];
Model.seed = async function () {
  for (const row of seedRows) {
    await this.updateOne({ key: row.key }, { $setOnInsert: { content: row.content } }, { upsert: true });
  }
};
module.exports = Model;
