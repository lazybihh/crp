const mongoose = require("mongoose");
const Schema = new mongoose.Schema({ key: { type: String, required: true, unique: true }, content: { type: mongoose.Schema.Types.Mixed, required: true } }, { timestamps: true });
const Model = mongoose.model("StudentSupport", Schema);
const seedRows = [
  {
    "key": "admissions",
    "content": {
      "hero": {
        "image": "/images/campus-2.jpg"
      },
      "session": "2026-27",
      "intro": {
        "eyebrow": "Students",
        "title": "Admissions 2026-27",
        "lead": "Admissions are open for the three-year diploma programmes. Follow the four steps below, keep the key dates handy and apply on the state admissions portal."
      },
      "courses": [
        {
          "id": "civil",
          "name": "Civil Engineering",
          "seats": 60
        },
        {
          "id": "computer",
          "name": "Computer Engineering",
          "seats": 54
        },
        {
          "id": "electrical",
          "name": "Electrical Engineering",
          "seats": 60
        },
        {
          "id": "electronics",
          "name": "Electronics & Communication",
          "seats": 54
        },
        {
          "id": "mechanical",
          "name": "Mechanical Engineering",
          "seats": 60
        },
        {
          "id": "plastic",
          "name": "Plastic Technology",
          "seats": 54
        }
      ],
      "steps": [
        {
          "title": "Note the key dates",
          "text": "Check the online admission dates and the counselling dates first. Both are in the downloads on this page."
        },
        {
          "title": "Apply on the state portal",
          "text": "Online admissions to the diploma programmes run through the Haryana technical admissions portal. Register and complete your application there."
        },
        {
          "title": "Attend counselling",
          "text": "Seats are allotted through counselling, based on the merit lists. Merit lists and counselling details are posted on this page and on the Notices page."
        },
        {
          "title": "Verify and join",
          "text": "Bring the documents listed for physical verification to the institute to confirm your seat."
        }
      ],
      "posters": [
        {
          "src": "/images/admission/admission-2026.jpeg",
          "label": "Admissions open 2026‑27"
        },
        {
          "src": "/images/admission/admission-notice-2026.jpeg",
          "label": "Official admission notice"
        }
      ],
      "documents": [
        {
          "label": "Key dates for online admissions",
          "href": "/docs/admission-key-dates.jpeg",
          "type": "JPEG"
        },
        {
          "label": "Counselling dates",
          "href": "/docs/admission-counselling-dates.pdf",
          "type": "PDF"
        },
        {
          "label": "Documents required for physical verification",
          "href": "/docs/admission-documents-list.docx",
          "type": "DOCX"
        },
        {
          "label": "Manual admission form",
          "href": "/docs/manual-admission-form.pdf",
          "type": "PDF"
        }
      ],
      "faqs": [
        {
          "q": "Where do I apply?",
          "a": "Online admissions run through the state technical admissions portal. Use the Apply button at the top of this page to open it."
        },
        {
          "q": "Which programmes can I choose?",
          "a": "Six three-year diplomas: Civil, Computer, Electrical, Electronics & Communication, Mechanical and Plastic Technology, approved by DTE Haryana and AICTE."
        },
        {
          "q": "Where are the merit lists and counselling dates?",
          "a": "Both are on this page under Notices and downloads. New lists are also posted on the Notices page."
        },
        {
          "q": "What if seats are still vacant after counselling?",
          "a": "The institute holds manual counselling for vacant seats and announces it on the Notices page. The manual admission form is in the downloads."
        },
        {
          "q": "Who can I ask for help?",
          "a": "Call the institute office or send an email - the details are at the bottom of this page."
        }
      ],
      "key": "admissions",
      "noticeIds": []
    }
  },
  {
    "key": "academic-calendar",
    "content": {
      "key": "academic-calendar",
      "hero": {
        "image": "/images/campus-3.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Academic Calendar",
        "lead": "Academic calendar and important academic documents."
      },
      "documents": [
        {
          "session": "2025-26",
          "label": "Academic Calendar 2025-26",
          "file": "/docs/academic-calendar-2025-26.pdf",
          "type": "PDF"
        }
      ],
      "note": "For assistance, contact the institute office."
    }
  },
  {
    "key": "online-learning",
    "content": {
      "hero": {
        "image": "/images/campus-workshop.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Online learning portals",
        "lead": "National and board portals with books, lectures and courses you can use alongside your classes. Each one opens in a new tab."
      },
      "portals": [
        {
          "id": "ndli",
          "name": "NDLI",
          "full": "National Digital Library of India",
          "host": "ndl.iitkgp.ac.in",
          "href": "https://ndl.iitkgp.ac.in/",
          "accent": "sky",
          "text": "A single-window digital library of books, articles and lectures from many institutions, developed by IIT Kharagpur for the Ministry of Education.",
          "topics": [
            "Books",
            "Articles",
            "Lectures"
          ]
        },
        {
          "id": "swayam",
          "name": "SWAYAM",
          "full": "Study Webs of Active-Learning for Young Aspiring Minds",
          "host": "swayam.gov.in",
          "href": "https://swayam.gov.in/",
          "accent": "orange",
          "text": "India's national platform for online courses, with video lectures and assessments on a wide range of subjects.",
          "topics": [
            "Online courses",
            "Video lectures",
            "Assessments"
          ]
        },
        {
          "id": "hsbte",
          "name": "HSBTE e-learning",
          "full": "Haryana State Board of Technical Education",
          "host": "",
          "href": "",
          "accent": "mix",
          "text": "The digital learning section of the board that conducts your diploma examinations.",
          "topics": [
            "Diploma e-learning",
            "Board resources"
          ]
        }
      ],
      "guide": [
        {
          "goal": "Prepare for your diploma exams",
          "to": "hsbte",
          "name": "HSBTE e-learning"
        },
        {
          "goal": "Learn a new subject or skill",
          "to": "swayam",
          "name": "SWAYAM"
        },
        {
          "goal": "Read books, articles and lectures",
          "to": "ndli",
          "name": "NDLI"
        }
      ],
      "related": [
        {
          "label": "Skill courses",
          "text": "Short courses to build job-ready skills.",
          "to": "/students/skill-courses"
        },
        {
          "label": "Student helpline",
          "text": "Stuck with a login or a course? Ask for help.",
          "to": "/students/helpline"
        }
      ],
      "key": "online-learning"
    }
  },
  {
    "key": "helpline",
    "content": {
      "hero": {
        "image": "/images/campus-2.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Student helpline",
        "lead": "Need help or have a question? Call or write to the institute office. This page lists every way to reach us."
      },
      "reach": [
        {
          "kind": "phone",
          "title": "Call the office",
          "text": "Speak to the institute office on either number."
        },
        {
          "kind": "email",
          "title": "Write to us",
          "text": "Send your question by email and keep a copy for yourself."
        },
        {
          "kind": "address",
          "title": "Visit the institute",
          "text": "Come to the main office during a working day."
        }
      ],
      "tips": [
        {
          "title": "Say who you are",
          "text": "Give your name, branch and year at the start."
        },
        {
          "title": "Keep details ready",
          "text": "Have your roll number or admission details at hand."
        },
        {
          "title": "Be clear",
          "text": "Say in one or two lines what help you need."
        }
      ],
      "notice": {
        "title": "Office hours are not published yet",
        "text": "The institute has not listed calling hours on its website. If nobody answers, try the other number or send an email."
      },
      "other": [
        {
          "label": "Grievance redressal",
          "text": "Raise a concern with the committee.",
          "to": "/students/grievance"
        },
        {
          "label": "E-services",
          "text": "Fees, digital library and e-contents.",
          "to": "/students/e-services"
        },
        {
          "label": "Code of conduct",
          "text": "Read the code for students (PDF).",
          "href": "/docs/code-of-conduct-for-students.pdf"
        }
      ],
      "key": "helpline"
    }
  },
  {
    "key": "grievance",
    "content": {
      "hero": {
        "image": "/images/campus-3.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "Grievance redressal",
        "lead": "If something is troubling you at the institute, you can say so. Your concern is read by a committee and acted on."
      },
      "steps": [
        {
          "title": "Share it",
          "text": "Fill in the form or tell the office."
        },
        {
          "title": "It is reviewed",
          "text": "The committee members read it."
        },
        {
          "title": "Action is taken",
          "text": "Corrective action is taken promptly."
        }
      ],
      "committees": [
        {
          "id": "main",
          "title": "Grievances Redressal Committee",
          "members": [
            {
              "role": "Chairman",
              "name": ""
            },
            {
              "role": "Member",
              "name": ""
            },
            {
              "role": "Member",
              "name": ""
            },
            {
              "role": "Member",
              "name": ""
            },
            {
              "role": "Member",
              "name": ""
            }
          ]
        },
        {
          "id": "online",
          "title": "Online Grievances Redressal Committee",
          "members": [
            {
              "role": "Chairman",
              "name": ""
            },
            {
              "role": "Member",
              "name": ""
            },
            {
              "role": "Member",
              "name": ""
            }
          ]
        }
      ],
      "key": "grievance"
    }
  },
  {
    "key": "e-services",
    "content": {
      "hero": {
        "image": "/images/campus-workshop.jpg"
      },
      "intro": {
        "eyebrow": "Students",
        "title": "E-services",
        "lead": "The institute's online services for students, all in one place. Pick a service and it opens in a new tab."
      },
      "services": [
        {
          "title": "Online Fees Facility",
          "text": "Pay your fees online through the bank's payment portal.",
          "site": "SBI Collect",
          "label": "Go to fee payment",
          "href": "https://www.onlinesbi.sbi/sbicollect/icollecthome.htm"
        },
        {
          "title": "Digital library",
          "text": "Read books, journals and study material online.",
          "site": "National Digital Library of India",
          "label": "Open the digital library",
          "href": "https://ndl.iitkgp.ac.in/"
        },
        {
          "title": "E-Contents",
          "text": "Digital lessons and learning material for polytechnic students.",
          "site": "HSBTE digital e-learning",
          "label": "Open e-contents",
          "href": ""
        }
      ],
      "goodToKnow": [
        {
          "text": "Check the web address before you enter any payment or login details."
        },
        {
          "text": "Keep a copy of every receipt or confirmation you get."
        },
        {
          "text": "If a link does not work, ask the institute office."
        }
      ],
      "related": [
        {
          "label": "Online learning",
          "text": "More free portals and courses.",
          "to": "/students/online-learning"
        },
        {
          "label": "Student helpline",
          "text": "Call or write to the office.",
          "to": "/students/helpline"
        },
        {
          "label": "Grievance redressal",
          "text": "Raise a concern with the committee.",
          "to": "/students/grievance"
        }
      ],
      "key": "e-services"
    }
  }
];
Model.seed = async function () {
  for (const row of seedRows) {
    await this.updateOne({ key: row.key }, { $setOnInsert: { content: row.content } }, { upsert: true });
  }
};
module.exports = Model;
