const mongoose = require("mongoose");
const sub = (fields) => new mongoose.Schema(fields, { _id: false });
const ResourceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  intro: sub({
    eyebrow: { type: String, default: "Students" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "Study resources" },
    lead: { type: String, default: "" },
  }),
  heroImage: { type: String, default: "/images/pages-banner.png" },
  aboutLink: { type: String, default: "" },
  related: [sub({
    label: { type: String, default: "" },
    text: { type: String, default: "" },
    href: { type: String, default: "" },
    to: { type: String, default: "" },
    external: { type: Boolean, default: false },
  })],
  tabs: [sub({
    id: { type: String, required: true },
    label: { type: String, default: "" },
    filters: [sub({ value: { type: Number, default: 0 }, label: { type: String, default: "" } })],
    files: [sub({
      name: { type: String, default: "" },
      semester: { type: Number, default: 0 },
      file: { type: String, default: "" },
      source: { type: String, default: "" },
    })],
  })],
}, { timestamps: true });

const Resource = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
const startingData = [
  {
    "slug": "applied-science",
    "name": "Applied Sciences",
    "order": 0,
    "intro": {
      "eyebrow": "Students",
      "title": "Applied Sciences",
      "subtitle": "Study resources",
      "lead": "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place."
    },
    "heroImage": "/images/pages-banner.png",
    "aboutLink": "/departments/applied-science",
    "related": [
      {
        "label": "Academic calendar",
        "text": "Session dates and holidays (PDF).",
        "href": "/docs/academic-calendar-2025-26.pdf",
        "external": true
      },
      {
        "label": "Online learning portals",
        "text": "NDLI, SWAYAM and HSBTE e-learning.",
        "to": "/students/online-learning"
      },
      {
        "label": "Student helpline",
        "text": "Ask for help with studies or the campus.",
        "to": "/students/helpline"
      }
    ],
    "tabs": [
      {
        "id": "lesson-plan",
        "label": "Lesson plan",
        "filters": [
          {
            "value": 1,
            "label": "Semester 1"
          }
        ],
        "files": [
          {
            "name": "English & communication skill Practical",
            "semester": 1,
            "file": "/docs/applied-science/lesson-plan/english-communication-skill-practical-lesson-plan.pdf",
            "source": "English_Practical_Lesson_Plan_2pSrWep.pdf"
          },
          {
            "name": "English & communication skill",
            "semester": 1,
            "file": "/docs/applied-science/lesson-plan/english-communication-skill-lesson-plan.pdf",
            "source": "English_Theory_Lesson_Plan_G1uRvfb.pdf"
          },
          {
            "name": "Chemistry",
            "semester": 1,
            "file": "/docs/applied-science/lesson-plan/chemistry-lesson-plan.pdf",
            "source": "Chem_1.pdf"
          },
          {
            "name": "Engineering Graphics",
            "semester": 1,
            "file": "/docs/applied-science/lesson-plan/engineering-graphics-lesson-plan.docx",
            "source": "ENGG-GRAPHICS-LP-1st_sudeep.docx"
          },
          {
            "name": "Physics",
            "semester": 1,
            "file": "/docs/applied-science/lesson-plan/physics-lesson-plan.pdf",
            "source": "physics.pdf"
          }
        ]
      },
      {
        "id": "outline-notes",
        "label": "Outline notes",
        "filters": [],
        "files": []
      },
      {
        "id": "question-papers",
        "label": "Question papers",
        "filters": [],
        "files": []
      },
      {
        "id": "syllabus",
        "label": "Syllabus",
        "filters": [],
        "files": []
      }
    ]
  },
  {
    "slug": "civil",
    "name": "Civil Engineering",
    "order": 1,
    "intro": {
      "eyebrow": "Students",
      "title": "Civil Engineering",
      "subtitle": "Study resources",
      "lead": "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place."
    },
    "heroImage": "/images/pages-banner.png",
    "aboutLink": "/departments/civil",
    "related": [
      {
        "label": "Academic calendar",
        "text": "Session dates and holidays (PDF).",
        "href": "/docs/academic-calendar-2025-26.pdf",
        "external": true
      },
      {
        "label": "Online learning portals",
        "text": "NDLI, SWAYAM and HSBTE e-learning.",
        "to": "/students/online-learning"
      },
      {
        "label": "Student helpline",
        "text": "Ask for help with studies or the campus.",
        "to": "/students/helpline"
      }
    ],
    "tabs": [
      {
        "id": "lesson-plan",
        "label": "Lesson plan",
        "filters": [
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "Building Construction",
            "semester": 3,
            "file": "/docs/civil/lesson-plan/building-construction-lesson-plan.pdf",
            "source": "3Civil_lessonplanbuildingconstruction.pdf"
          },
          {
            "name": "Estimating And Costing",
            "semester": 5,
            "file": "/docs/civil/lesson-plan/estimating-and-costing-lesson-plan.pdf",
            "source": "5Civil_Estimating_And_Costing_LESSON_PLAN.pdf"
          }
        ]
      },
      {
        "id": "outline-notes",
        "label": "Outline notes",
        "filters": [],
        "files": []
      },
      {
        "id": "question-papers",
        "label": "Question papers",
        "filters": [],
        "files": []
      },
      {
        "id": "syllabus",
        "label": "Syllabus",
        "filters": [
          {
            "value": 1,
            "label": "Semester 1"
          }
        ],
        "files": [
          {
            "name": "Sem 1-6 Study Scheme & Syllabus",
            "semester": 1,
            "file": "/docs/civil/syllabus/study-scheme-and-syllabus-sem-1.pdf",
            "source": "Civil_Engineering.pdf"
          }
        ]
      }
    ]
  },
  {
    "slug": "computer",
    "name": "Computer Engineering",
    "order": 2,
    "intro": {
      "eyebrow": "Students",
      "title": "Computer Engineering",
      "subtitle": "Study resources",
      "lead": "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place."
    },
    "heroImage": "/images/pages-banner.png",
    "aboutLink": "/departments/computer",
    "related": [
      {
        "label": "Academic calendar",
        "text": "Session dates and holidays (PDF).",
        "href": "/docs/academic-calendar-2025-26.pdf",
        "external": true
      },
      {
        "label": "Online learning portals",
        "text": "NDLI, SWAYAM and HSBTE e-learning.",
        "to": "/students/online-learning"
      },
      {
        "label": "Student helpline",
        "text": "Ask for help with studies or the campus.",
        "to": "/students/helpline"
      }
    ],
    "tabs": [
      {
        "id": "lesson-plan",
        "label": "Lesson plan",
        "filters": [
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "PIC",
            "semester": 3,
            "file": "/docs/computer/lesson-plan/pic-lesson-plan.docx",
            "source": "PIC__Lesson_Plan.docx"
          },
          {
            "name": "O.S",
            "semester": 3,
            "file": "/docs/computer/lesson-plan/operating-system-lesson-plan.docx",
            "source": "lesson_plan_Operating_System1_1.docx"
          },
          {
            "name": "DBMS",
            "semester": 3,
            "file": "/docs/computer/lesson-plan/dbms-lesson-plan.docx",
            "source": "D.B.M.S_Lession_Plan.docx"
          },
          {
            "name": "D.E",
            "semester": 3,
            "file": "/docs/computer/lesson-plan/de-lesson-plan.docx",
            "source": "Lesson_Plan_DE.docx"
          },
          {
            "name": "Computer Networks",
            "semester": 5,
            "file": "/docs/computer/lesson-plan/computer-networks-lesson-plan.docx",
            "source": "Lesson_Plan_CN.docx"
          },
          {
            "name": "Cloud Computing",
            "semester": 5,
            "file": "/docs/computer/lesson-plan/cloud-computing-lesson-plan.docx",
            "source": "Priyankacloud_computing_5th.docx"
          },
          {
            "name": "PHP",
            "semester": 5,
            "file": "/docs/computer/lesson-plan/php-lesson-plan.docx",
            "source": "Priyankaphp_5th_sem.docx"
          },
          {
            "name": "Python",
            "semester": 5,
            "file": "/docs/computer/lesson-plan/python-lesson-plan.docx",
            "source": "Dr_R.Rathee__Python.docx"
          }
        ]
      },
      {
        "id": "outline-notes",
        "label": "Outline notes",
        "filters": [
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "DBMS E-Contents",
            "semester": 3,
            "file": "/docs/computer/outline-notes/dbms-e-contents.pptx",
            "source": "dbms_semester_IV.pptx"
          },
          {
            "name": "Cloud Computing E-Contents",
            "semester": 5,
            "file": "/docs/computer/outline-notes/cloud-computing-e-contents.pdf",
            "source": "cloud_V.pdf"
          },
          {
            "name": "Computer Networks E-Contents Part 1",
            "semester": 5,
            "file": "/docs/computer/outline-notes/computer-networks-e-contents-part-1.pdf",
            "source": "COMPUTER_NETWORKS_UNIT_123.pdf"
          },
          {
            "name": "Computer Networks E-Contents Part 2",
            "semester": 5,
            "file": "/docs/computer/outline-notes/computer-networks-e-contents-part-2.pdf",
            "source": "COMPUTER_NETWORS_4-7.pdf"
          }
        ]
      },
      {
        "id": "question-papers",
        "label": "Question papers",
        "filters": [
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "Programming in C",
            "semester": 3,
            "file": "/docs/computer/question-papers/programming-in-c-sem-3.pdf",
            "source": "PIC-3rd-sem.pdf"
          },
          {
            "name": "Operating System",
            "semester": 3,
            "file": "/docs/computer/question-papers/operating-system-sem-3.pdf",
            "source": "OS-3Sem.pdf"
          },
          {
            "name": "Computer Networks",
            "semester": 5,
            "file": "/docs/computer/question-papers/computer-networks-sem-5.pdf",
            "source": "computer-network-5th-sem-question-paper.pdf"
          },
          {
            "name": "Cloud Computing",
            "semester": 5,
            "file": "/docs/computer/question-papers/cloud-computing-sem-5.pdf",
            "source": "Cloud-computing-5th-sem.pdf"
          },
          {
            "name": "Python",
            "semester": 5,
            "file": "/docs/computer/question-papers/python-sem-5.pdf",
            "source": "computer-5-sem-python.pdf"
          },
          {
            "name": "PHP",
            "semester": 5,
            "file": "/docs/computer/question-papers/php-sem-5.pdf",
            "source": "php-5th-sem.pdf"
          },
          {
            "name": "Software Engineering",
            "semester": 5,
            "file": "/docs/computer/question-papers/software-engineering-sem-5.pdf",
            "source": "software-engineering.pdf"
          }
        ]
      },
      {
        "id": "syllabus",
        "label": "Syllabus",
        "filters": [
          {
            "value": 0,
            "label": "All semesters"
          },
          {
            "value": 1,
            "label": "Semester 1"
          },
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "Computer Engineering",
            "semester": 0,
            "file": "/docs/computer/syllabus/computer-engineering.pdf",
            "source": "Computer_Engineering.pdf"
          },
          {
            "name": "Sem 1-6 Study Scheme & Syllabus",
            "semester": 1,
            "file": "/docs/computer/syllabus/study-scheme-and-syllabus-sem-1.pdf",
            "source": "Computer_Engineering_o08TrpC.pdf"
          },
          {
            "name": "Sem 1-6 Study Scheme & Syllabus",
            "semester": 3,
            "file": "/docs/computer/syllabus/study-scheme-and-syllabus-sem-3.pdf",
            "source": "Computer_Engineering_itcSZcb.pdf"
          },
          {
            "name": "Sem 1-6 Study Scheme & Syllabus",
            "semester": 5,
            "file": "/docs/computer/syllabus/study-scheme-and-syllabus-sem-5.pdf",
            "source": "Computer_Engineering_QhWDF5y.pdf"
          }
        ]
      }
    ]
  },
  {
    "slug": "electrical",
    "name": "Electrical Engineering",
    "order": 3,
    "intro": {
      "eyebrow": "Students",
      "title": "Electrical Engineering",
      "subtitle": "Study resources",
      "lead": "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place."
    },
    "heroImage": "/images/pages-banner.png",
    "aboutLink": "/departments/electrical",
    "related": [
      {
        "label": "Academic calendar",
        "text": "Session dates and holidays (PDF).",
        "href": "/docs/academic-calendar-2025-26.pdf",
        "external": true
      },
      {
        "label": "Online learning portals",
        "text": "NDLI, SWAYAM and HSBTE e-learning.",
        "to": "/students/online-learning"
      },
      {
        "label": "Student helpline",
        "text": "Ask for help with studies or the campus.",
        "to": "/students/helpline"
      }
    ],
    "tabs": [
      {
        "id": "lesson-plan",
        "label": "Lesson plan",
        "filters": [
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "Electrical Engg. Material",
            "semester": 3,
            "file": "/docs/electrical/lesson-plan/electrical-engg-material-sem-3.pdf",
            "source": "Elect._Engg._Material-3rd_sem.pdf"
          },
          {
            "name": "Electrical Machines - I",
            "semester": 3,
            "file": "/docs/electrical/lesson-plan/electrical-machines-1-sem-3.pdf",
            "source": "Electrical_Machines-I_-_3rd_sem.pdf"
          },
          {
            "name": "Elect. Measurement & Instrument",
            "semester": 3,
            "file": "/docs/electrical/lesson-plan/measurement-and-instrument-sem-3.pdf",
            "source": "Elect._Measurement__Instrumentation-3rd_sem.pdf"
          },
          {
            "name": "Analog & Digital Electronics",
            "semester": 3,
            "file": "/docs/electrical/lesson-plan/analog-and-digital-electronics-sem-3.pdf",
            "source": "Analog__Digital_Electronics-3rd_sem.pdf"
          },
          {
            "name": "Power System",
            "semester": 5,
            "file": "/docs/electrical/lesson-plan/power-system-sem-5.pdf",
            "source": "Power_System-5th_sem.pdf"
          },
          {
            "name": "Elect. Vehicle Technology",
            "semester": 5,
            "file": "/docs/electrical/lesson-plan/vehicle-technology-sem-5.pdf",
            "source": "Elect._Vehicle_Technology-5th_sem.pdf"
          },
          {
            "name": "Industrial Electronic Control of Drivers",
            "semester": 5,
            "file": "/docs/electrical/lesson-plan/industrial-electronic-control-of-drivers-sem-5.pdf",
            "source": "Industrial_Electronics_Control_of_Drives-5th_sem.pdf"
          }
        ]
      },
      {
        "id": "outline-notes",
        "label": "Outline notes",
        "filters": [],
        "files": []
      },
      {
        "id": "question-papers",
        "label": "Question papers",
        "filters": [],
        "files": []
      },
      {
        "id": "syllabus",
        "label": "Syllabus",
        "filters": [
          {
            "value": 1,
            "label": "Semester 1"
          }
        ],
        "files": [
          {
            "name": "Sem 1-6 Study Scheme & Syllabus",
            "semester": 1,
            "file": "/docs/electrical/syllabus/study-scheme-and-syllabus-sem-1.pdf",
            "source": "Electrical_Engineering.pdf"
          }
        ]
      }
    ]
  },
  {
    "slug": "electronics",
    "name": "Electronics & Communication Engineering",
    "order": 4,
    "intro": {
      "eyebrow": "Students",
      "title": "Electronics & Communication Engineering",
      "subtitle": "Study resources",
      "lead": "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place."
    },
    "heroImage": "/images/pages-banner.png",
    "aboutLink": "/departments/electronics",
    "related": [
      {
        "label": "Academic calendar",
        "text": "Session dates and holidays (PDF).",
        "href": "/docs/academic-calendar-2025-26.pdf",
        "external": true
      },
      {
        "label": "Online learning portals",
        "text": "NDLI, SWAYAM and HSBTE e-learning.",
        "to": "/students/online-learning"
      },
      {
        "label": "Student helpline",
        "text": "Ask for help with studies or the campus.",
        "to": "/students/helpline"
      }
    ],
    "tabs": [
      {
        "id": "lesson-plan",
        "label": "Lesson plan",
        "filters": [
          {
            "value": 1,
            "label": "Semester 1"
          },
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "FEE",
            "semester": 1,
            "file": "/docs/electronics/lesson-plan/fee-lesson-plan.pdf",
            "source": "Lesson_Plan_FEE.pdf"
          },
          {
            "name": "EDC",
            "semester": 3,
            "file": "/docs/electronics/lesson-plan/edc-lesson-plan.docx",
            "source": "ECE_EDC_3RD_SEM_LESSONS_PLAN.docx"
          },
          {
            "name": "ADC",
            "semester": 3,
            "file": "/docs/electronics/lesson-plan/adc-lesson-plan.pdf",
            "source": "Lesson_Plan-ADC.pdf"
          },
          {
            "name": "Digital Electronics",
            "semester": 3,
            "file": "/docs/electronics/lesson-plan/digital-electronics-lesson-plan.pdf",
            "source": "Lesson_Plan_DE.pdf"
          },
          {
            "name": "Digital Electronics Practical",
            "semester": 3,
            "file": "/docs/electronics/lesson-plan/digital-electronics-practical-lesson-plan.pdf",
            "source": "DE_Practical_Lesson_Plan.pdf"
          },
          {
            "name": "Programming in C",
            "semester": 3,
            "file": "/docs/electronics/lesson-plan/programming-in-c-lesson-plan.docx",
            "source": "Lesson_Plan_PIC__Dalvir.docx"
          },
          {
            "name": "MICROCONTROLLER",
            "semester": 5,
            "file": "/docs/electronics/lesson-plan/microcontroller-lesson-plan.xlsx",
            "source": "LESSON_PLAN_MC_5TH_SEM_1.xlsx"
          },
          {
            "name": "PLC and Scada",
            "semester": 5,
            "file": "/docs/electronics/lesson-plan/plc-and-scada-lesson-plan.pdf",
            "source": "Lesson_Plan_PLC_and_Scada.pdf"
          },
          {
            "name": "INSTRUMENTATION LP",
            "semester": 5,
            "file": "/docs/electronics/lesson-plan/instrumentation-lesson-plan.pdf",
            "source": "INSTRUMENTATION-LP_pdf.pdf"
          },
          {
            "name": "Optical Fiber Communication",
            "semester": 5,
            "file": "/docs/electronics/lesson-plan/optical-fiber-communication-lesson-plan.pdf",
            "source": "lesson_plan_OFC.pdf"
          },
          {
            "name": "WMC",
            "semester": 5,
            "file": "/docs/electronics/lesson-plan/wmc-lesson-plan.pdf",
            "source": "Lesson_Plan_WMC_1.pdf"
          }
        ]
      },
      {
        "id": "outline-notes",
        "label": "Outline notes",
        "filters": [],
        "files": []
      },
      {
        "id": "question-papers",
        "label": "Question papers",
        "filters": [],
        "files": []
      },
      {
        "id": "syllabus",
        "label": "Syllabus",
        "filters": [
          {
            "value": 1,
            "label": "Semester 1"
          }
        ],
        "files": [
          {
            "name": "Sem 1-6 Study Scheme & Syllabus",
            "semester": 1,
            "file": "/docs/electronics/syllabus/study-scheme-and-syllabus-sem-1.pdf",
            "source": "Electronics_and_Communication_Engineering.pdf"
          }
        ]
      }
    ]
  },
  {
    "slug": "mechanical",
    "name": "Mechanical Engineering",
    "order": 5,
    "intro": {
      "eyebrow": "Students",
      "title": "Mechanical Engineering",
      "subtitle": "Study resources",
      "lead": "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place."
    },
    "heroImage": "/images/pages-banner.png",
    "aboutLink": "/departments/mechanical",
    "related": [
      {
        "label": "Academic calendar",
        "text": "Session dates and holidays (PDF).",
        "href": "/docs/academic-calendar-2025-26.pdf",
        "external": true
      },
      {
        "label": "Online learning portals",
        "text": "NDLI, SWAYAM and HSBTE e-learning.",
        "to": "/students/online-learning"
      },
      {
        "label": "Student helpline",
        "text": "Ask for help with studies or the campus.",
        "to": "/students/helpline"
      }
    ],
    "tabs": [
      {
        "id": "lesson-plan",
        "label": "Lesson plan",
        "filters": [
          {
            "value": 3,
            "label": "Semester 3"
          },
          {
            "value": 5,
            "label": "Semester 5"
          }
        ],
        "files": [
          {
            "name": "Thermodynamics-I",
            "semester": 3,
            "file": "/docs/mechanical/lesson-plan/thermodynamics-1-lesson-plan.pdf",
            "source": "TD-1_lesson_plan_Mech._3rd.pdf"
          },
          {
            "name": "Mech. Engg. Drawing",
            "semester": 3,
            "file": "/docs/mechanical/lesson-plan/mech-engg-drawing-lesson-plan.docx",
            "source": "MED_3RDSEM_MECH.docx"
          },
          {
            "name": "Strength Of Materials",
            "semester": 3,
            "file": "/docs/mechanical/lesson-plan/strength-of-materials-lesson-plan.pdf",
            "source": "ME_SOM_3rd_BS.pdf"
          },
          {
            "name": "Refrigeration & Air Conditioning",
            "semester": 5,
            "file": "/docs/mechanical/lesson-plan/refrigeration-and-air-conditioning-lesson-plan.pdf",
            "source": "RAC__lesson_planMech.5th.pdf"
          },
          {
            "name": "CNC Machines & Automation",
            "semester": 5,
            "file": "/docs/mechanical/lesson-plan/cnc-machines-and-automation-lesson-plan.pdf",
            "source": "ME_CNC_5th_BS.pdf"
          },
          {
            "name": "Industrial Engineering",
            "semester": 5,
            "file": "/docs/mechanical/lesson-plan/industrial-engineering-lesson-plan.pdf",
            "source": "ME_IE_5th_BS.pdf"
          }
        ]
      },
      {
        "id": "outline-notes",
        "label": "Outline notes",
        "filters": [],
        "files": []
      },
      {
        "id": "question-papers",
        "label": "Question papers",
        "filters": [],
        "files": []
      },
      {
        "id": "syllabus",
        "label": "Syllabus",
        "filters": [
          {
            "value": 1,
            "label": "Semester 1"
          }
        ],
        "files": [
          {
            "name": "Sem 1-6 Study Scheme & Syllabus",
            "semester": 1,
            "file": "/docs/mechanical/syllabus/study-scheme-and-syllabus-sem-1.pdf",
            "source": "Mechanical_Engineering.pdf"
          }
        ]
      }
    ]
  },
  {
    "slug": "plastic",
    "name": "Plastic Technology",
    "order": 6,
    "intro": {
      "eyebrow": "Students",
      "title": "Plastic Technology",
      "subtitle": "Study resources",
      "lead": "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place."
    },
    "heroImage": "/images/pages-banner.png",
    "aboutLink": "/departments/plastic",
    "related": [
      {
        "label": "Academic calendar",
        "text": "Session dates and holidays (PDF).",
        "href": "/docs/academic-calendar-2025-26.pdf",
        "external": true
      },
      {
        "label": "Online learning portals",
        "text": "NDLI, SWAYAM and HSBTE e-learning.",
        "to": "/students/online-learning"
      },
      {
        "label": "Student helpline",
        "text": "Ask for help with studies or the campus.",
        "to": "/students/helpline"
      }
    ],
    "tabs": [
      {
        "id": "lesson-plan",
        "label": "Lesson plan",
        "filters": [
          {
            "value": 0,
            "label": "All semesters"
          }
        ],
        "files": [
          {
            "name": "Lesson Plan Odd Semester Plastic Tech",
            "semester": 0,
            "file": "/docs/plastic/lesson-plan/lesson-plan-odd-semester-plastic-tech.pdf",
            "source": "Lesson_Plan__odd_Semester.pdf"
          }
        ]
      },
      {
        "id": "outline-notes",
        "label": "Outline notes",
        "filters": [],
        "files": []
      },
      {
        "id": "question-papers",
        "label": "Question papers",
        "filters": [],
        "files": []
      },
      {
        "id": "syllabus",
        "label": "Syllabus",
        "filters": [],
        "files": []
      }
    ]
  }
];

Resource.seed = async function () {
  for (const row of startingData) {
    await Resource.updateOne({ slug: row.slug }, { $setOnInsert: row }, { upsert: true });
  }
};
Resource.startingData = startingData;
module.exports = Resource;
