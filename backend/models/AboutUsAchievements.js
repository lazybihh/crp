const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const Model = mongoose.model('AboutUsAchievements', Schema);

const seedRows = [
  {
    "key": "luminaries",
    "content": {
      "key": "luminaries",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Luminaries",
        "lead": "The people whose vision, leadership and work shaped the institute and keep it moving forward."
      },
      "founder": {
        "name": "Deenbandhu Sir Chhotu Ram",
        "role": "The Messiah of Farmers",
        "text": "A great statesman, social reformer and the voice of the farmers. His vision for rural upliftment and education continues to inspire us.",
        "image": "/images/leader-chhotu-ram.jpg",
        "initials": "CR"
      },
      "leaders": [
        {
          "name": "Sh. Gulab Singh",
          "role": "President, JES Society (Regd.)",
          "text": "Committed to providing better academic and infrastructure facilities for the overall growth of our students.",
          "image": "/images/leader-gulab-singh.jpg",
          "initials": "GS"
        },
        {
          "name": "Dr. Sitender Kumar",
          "role": "Principal, Chhotu Ram Polytechnic",
          "text": "Dedicated to maintaining high standards of technical education and ensuring a bright and successful future for our students.",
          "image": "/images/principal.png",
          "initials": "SK"
        }
      ],
      "distinguished": [
        {
          "name": "Distinguished alumnus",
          "role": "Batch year, Civil Engineering",
          "text": "A short line about the career or contribution that makes this person a luminary of the institute."
        },
        {
          "name": "Distinguished alumnus",
          "role": "Batch year, Electrical Engineering",
          "text": "A short line about the career or contribution that makes this person a luminary of the institute."
        },
        {
          "name": "Distinguished guest",
          "role": "Designation, organisation",
          "text": "A short line about the visit, lecture or support this guest gave to the institute."
        }
      ]
    }
  },
  {
    "key": "projects",
    "content": {
      "key": "projects",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Projects",
        "lead": "Where classroom learning turns into things that work - for the campus and for the community."
      },
      "cdtp": {
        "short": "CDTP",
        "name": "Community Development through Polytechnics",
        "text": "Under CDTP the institute takes its skills to the people around it, with training and technology support for the local community.",
        "points": [
          "Skill training for the community",
          "Technology and awareness support",
          "Students working with real needs"
        ]
      },
      "projects": [
        {
          "tag": "Civil Engineering",
          "title": "Sample project title",
          "text": "A short line about what the students built or studied and what it achieved."
        },
        {
          "tag": "Computer Engineering",
          "title": "Sample project title",
          "text": "A short line about what the students built or studied and what it achieved."
        },
        {
          "tag": "Mechanical Engineering",
          "title": "Sample project title",
          "text": "A short line about what the students built or studied and what it achieved."
        }
      ],
      "showcase": [
        {
          "date": "2025",
          "text": "Project showcase recognised by industry guests"
        },
        {
          "date": "Dec 2026",
          "text": "Annual technical exhibition"
        }
      ]
    }
  },
  {
    "key": "extracurricular",
    "content": {
      "key": "extracurricular",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Extracurricular achievements",
        "lead": "NCC, sports and culture - the activities that build confidence, teamwork and character alongside the diploma."
      },
      "ncc": {
        "since": "1949",
        "title": "National Cadet Corps",
        "text": "The institute's NCC unit was instituted in 1949. Cadets take part in camps, parades and service activities that build discipline and leadership."
      },
      "sports": [
        "Volleyball",
        "Football",
        "Basketball",
        "Badminton",
        "Kho kho"
      ],
      "culture": {
        "title": "Culture and campus life",
        "text": "Cultural events run through the year, and the annual cultural fest brings every department on stage together."
      },
      "achievements": [
        {
          "date": "2026",
          "text": "NCC cadets selected for state camp"
        },
        {
          "date": "2026",
          "text": "Students win inter-polytechnic sports meet"
        },
        {
          "date": "2025",
          "text": "Project showcase recognised by industry guests"
        }
      ],
      "upcoming": [
        {
          "date": "Dec 2026",
          "text": "Annual technical exhibition"
        },
        {
          "date": "Jan 2027",
          "text": "Republic Day parade and NCC display"
        },
        {
          "date": "Feb 2027",
          "text": "Cultural fest"
        }
      ]
    }
  },
  {
    "key": "unnat-bharat-abhiyan",
    "content": {
      "key": "unnat-bharat-abhiyan",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Unnat Bharat Abhiyan",
        "lead": "Taking the institute's knowledge to nearby villages - and learning from them in return."
      },
      "about": "Unnat Bharat Abhiyan is a national programme in which higher education institutions work with nearby villages to find local needs and help solve them with technology, skills and awareness. At our institute, students and staff take part together.",
      "activities": [
        {
          "title": "Adopt villages",
          "text": "The institute works with a small group of nearby villages over a longer period."
        },
        {
          "title": "Understand needs",
          "text": "Students survey the village and list its needs in water, energy, health and livelihood."
        },
        {
          "title": "Skills and technology",
          "text": "Workshops and simple technology solutions prepared in our labs and workshop."
        },
        {
          "title": "Awareness drives",
          "text": "Camps and sessions on health, hygiene, cleanliness and digital literacy."
        }
      ],
      "steps": [
        {
          "title": "Join the team",
          "text": "Students sign up with the programme coordinator."
        },
        {
          "title": "Visit the village",
          "text": "Small groups visit with a teacher and meet the community."
        },
        {
          "title": "Plan and act",
          "text": "Choose one need and work on it with the villagers."
        },
        {
          "title": "Report back",
          "text": "Share the results with the institute and the village."
        }
      ]
    }
  }
];

Model.seed = async function () {
  for (const row of seedRows) {
    await this.updateOne({ key: row.key }, { $setOnInsert: { content: row.content } }, { upsert: true });
  }
};

module.exports = Model;
