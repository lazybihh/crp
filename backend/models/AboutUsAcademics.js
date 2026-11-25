const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const Model = mongoose.model('AboutUsAcademics', Schema);

const seedRows = [
  {
    "key": "courses",
    "content": {
      "key": "courses",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Courses offered",
        "lead": "Six three-year diplomas approved by DTE Haryana and AICTE, supported by two foundation departments."
      },
      "courses": [
        {
          "id": "civil",
          "name": "Civil Engineering",
          "seats": 60,
          "text": "One of the broadest engineering fields - buildings, roads, water and the structures around us."
        },
        {
          "id": "computer",
          "name": "Computer Engineering",
          "seats": 54,
          "text": "Software development and testing, networking and hardware."
        },
        {
          "id": "electrical",
          "name": "Electrical Engineering",
          "seats": 60,
          "text": "Power, machines and control, taught with a mission of high-quality education."
        },
        {
          "id": "electronics",
          "name": "Electronics & Communication",
          "seats": 54,
          "text": "The study and application of physics to design and operate electronic devices."
        },
        {
          "id": "mechanical",
          "name": "Mechanical Engineering",
          "seats": 60,
          "text": "Design, development, building and testing of things that move."
        },
        {
          "id": "plastic",
          "name": "Plastic Technology",
          "seats": 54,
          "text": "How plastics replace everyday and engineering items - materials, moulding and processing."
        }
      ],
      "foundation": [
        {
          "id": "applied-science",
          "name": "Applied Sciences",
          "text": "Communication skills, physics, chemistry and mathematics in the first two semesters."
        },
        {
          "id": "workshop",
          "name": "Workshop Department",
          "text": "An intensive, short-duration hands-on learning experience."
        }
      ]
    }
  },
  {
    "key": "results",
    "content": {
      "key": "results",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Results",
        "lead": "Session-wise result sheets of the institute, newest first."
      },
      "sheets": [
        {
          "month": "Mar",
          "year": "2024",
          "title": "Result sheet, March 2024",
          "note": "Opens the result folder on Google Drive"
        },
        {
          "month": "Feb",
          "year": "2023",
          "title": "Result sheet, February 2023",
          "note": "Session result sheet"
        },
        {
          "month": "Jul",
          "year": "2022",
          "title": "Result sheet, July 2022",
          "note": "Session result sheet"
        }
      ],
      "steps": [
        {
          "title": "Open the HSBTE website",
          "text": "Results and marks are declared by the Haryana State Board of Technical Education, Panchkula."
        },
        {
          "title": "Choose your examination",
          "text": "Open the results section and select the session of your examination."
        },
        {
          "title": "Enter your roll number",
          "text": "View your result and save a copy for your records."
        }
      ]
    }
  },
  {
    "key": "placements",
    "content": {
      "key": "placements",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Placements",
        "lead": "A placement cell that works all year - from industrial training to the final interview."
      },
      "officer": {
        "name": "Mr. Jai Kanwar",
        "role": "Training & Placement Officer"
      },
      "support": [
        {
          "title": "Training & Placement Office",
          "text": "A separate, fully furnished, air-conditioned office for the placement cell."
        },
        {
          "title": "Mini-auditorium",
          "text": "An air-conditioned mini-auditorium for pre-placement talks."
        },
        {
          "title": "Smart classrooms",
          "text": "Used for recruitment tests and interviews."
        },
        {
          "title": "Japanese language course",
          "text": "A free fundamental course to help students get placed in Japanese-oriented companies."
        },
        {
          "title": "Industrial training",
          "text": "Mandatory for students, with government organisations preferred."
        },
        {
          "title": "Industry-Institute Cell",
          "text": "Expert lectures, workshops at institute and state levels, and seminars."
        }
      ],
      "steps": [
        "Companies are invited by email and fix a test or interview date",
        "Pre-placement talk (PPT)",
        "Pre-placement assessment: technical test, group discussion, psychomotor test or interview",
        "Screening and shortlisting for the final interview",
        "Technical interview, followed by an HR interview",
        "Offer letter with pay, package, fringe benefits and terms"
      ],
      "recruiters": [
        {
          "name": "HCL",
          "logo": "/images/recruiter-hcl.jpg"
        },
        {
          "name": "Jindal Steel & Power",
          "logo": "/images/recruiter-jindal-steel-power.jpg"
        },
        {
          "name": "Tata Motors",
          "logo": "/images/recruiter-tata-motors.jpg"
        },
        {
          "name": "Tech Mahindra",
          "logo": "/images/recruiter-tech-mahindra.jpg"
        }
      ],
      "activity": [
        {
          "date": "23 Feb 2026",
          "text": "Campus drive by VVDN Technologies, Manesar, in the Conference Hall"
        },
        {
          "date": "2026",
          "text": "Industrial visits for 3rd and 5th semester students"
        }
      ]
    }
  },
  {
    "key": "entrepreneurship",
    "content": {
      "key": "entrepreneurship",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Entrepreneurship",
        "lead": "Turning ideas from the classroom and workshop into skills, small ventures and real work."
      },
      "welcome": "Our students learn to make things - and some go on to build their own work. The institute backs that spirit with an incubator, freelancing practice, skill courses and apprenticeships.",
      "programmes": [
        {
          "title": "Incubator",
          "text": "A space for students to turn project ideas into working prototypes.",
          "to": "/students/incubator"
        },
        {
          "title": "Freelancing",
          "text": "Learn to find and complete paid project work while still studying.",
          "to": "/students/freelancing"
        },
        {
          "title": "Skill courses",
          "text": "Short courses that add job-ready and business-ready skills.",
          "to": "/students/skill-courses"
        },
        {
          "title": "Apprenticeship",
          "text": "Learn on the job with industry partners.",
          "to": "/students/apprenticeship"
        }
      ],
      "journey": [
        {
          "title": "Spark an idea",
          "text": "Start with a problem you see in class, workshop or village."
        },
        {
          "title": "Build a prototype",
          "text": "Use the labs and workshop to make a first working version."
        },
        {
          "title": "Get feedback",
          "text": "Show it to teachers and industry guests and improve it."
        },
        {
          "title": "Launch small",
          "text": "Take it to your first users, customers or competitions."
        }
      ]
    }
  },
  {
    "key": "annual-report",
    "content": {
      "key": "annual-report",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Annual reports",
        "lead": "Annual reports and institutional documents of Chhotu Ram Polytechnic."
      }
    }
  }
];

Model.seed = async function () {
  for (const row of seedRows) {
    await this.updateOne({ key: row.key }, { $setOnInsert: { content: row.content } }, { upsert: true });
  }
};

module.exports = Model;
