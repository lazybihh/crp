const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const Model = mongoose.model('AboutUsInstitute', Schema);

const seedRows = [
  {
    "key": "history",
    "content": {
      "key": "history",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "History of C.R. Polytechnic",
        "lead": "From two-year draftsman courses to six three-year diplomas - the story of a leading technical institute of Northern India."
      },
      "story": [
        "This leading technical institute of Northern India began with two-year courses in draftsman (Civil) at the time of its inception. Today it offers three-year diplomas in Civil, Electrical, Mechanical, Electronics & Communication, Plastic Technology and Computer Engineering, introduced from time to time.",
        "All the courses have been duly approved by the Director of Technical Education, Haryana, and the All India Council for Technical Education, New Delhi. The Haryana Government has always been kind and liberal in granting aid to the institute, and the institute has worked day and night for the all-round development of its students.",
        "The sincere and complete involvement of management and staff can be seen in the results achieved by the students in academics as well as in various extra-curricular activities."
      ],
      "facts": [
        {
          "value": "1956",
          "label": "Serving students since"
        },
        {
          "value": "1949",
          "label": "NCC unit instituted"
        },
        {
          "value": "6",
          "label": "Three-year diplomas"
        },
        {
          "value": "2",
          "label": "Foundation departments"
        }
      ],
      "timeline": [
        {
          "when": "1949",
          "title": "NCC unit instituted",
          "text": "The institute's NCC unit begins, building discipline and service among cadets."
        },
        {
          "when": "1956",
          "title": "The institute begins",
          "text": "Two-year draftsman (Civil) courses start - the first step in a long journey of technical education."
        },
        {
          "when": "Later years",
          "title": "New trades are added",
          "text": "Electrical, Mechanical, Electronics & Communication, Plastic Technology and Computer Engineering are introduced one by one."
        },
        {
          "when": "Today",
          "title": "Six diplomas, one campus",
          "text": "Three-year diplomas approved by DTE Haryana and AICTE, supported by Applied Sciences and the Workshop Department."
        }
      ],
      "mission": [
        "Meet the needs of industry and commerce by supplying skilled graduates and promoting technology transfer.",
        "Deliver high-quality diploma-level teaching that empowers students to handle technological and socio-economic challenges.",
        "Expand the diploma programmes and strengthen partnerships with industry as technology advances.",
        "Develop the faculty and supporting staff.",
        "Set trends and serve as a model for other technical institutions.",
        "Support national development and promote national integration.",
        "Instil moral values in students."
      ]
    }
  },
  {
    "key": "principal-message",
    "content": {
      "key": "principal-message",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Principal's desk",
        "lead": "A few words to students, parents and everyone who believes in technical education."
      },
      "principal": {
        "name": "Dr. Sitender Kumar",
        "role": "Principal, Chhotu Ram Polytechnic",
        "photo": "/images/principal.png",
        "quote": "We do not only teach a trade - we help young people become confident, employable engineers.",
        "paragraphs": [
          "Chhotu Ram Polytechnic began with two-year draftsman courses and has grown into one of the leading technical institutes in the region. Our strength is the link between classroom, workshop and industry.",
          "Every student here gets practical training, industrial exposure and a placement cell that works all year. Our teachers guide each batch with patience, and our alumni are the best proof that the approach works.",
          "To every student joining us: work with your hands, ask questions and use the campus fully. To every parent: your trust is the reason we keep raising the bar. I invite you to visit the campus and see it for yourself."
        ]
      },
      "pillars": [
        {
          "title": "Practical training",
          "text": "Workshops and laboratories make every concept something students can build and test."
        },
        {
          "title": "Industry exposure",
          "text": "Industrial visits, training and a placement cell connect the classroom to real work."
        },
        {
          "title": "Care for every student",
          "text": "Guidance, activities and facilities that help each student grow with confidence."
        }
      ]
    }
  },
  {
    "key": "rank-accreditation",
    "content": {
      "key": "rank-accreditation",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Rank & accreditation",
        "lead": "The approvals and affiliation that stand behind every diploma awarded here."
      },
      "approvals": [
        {
          "by": "AICTE, New Delhi",
          "role": "Approved by",
          "text": "The All India Council for Technical Education approves the diploma programmes and their intake."
        },
        {
          "by": "HSBTE, Panchkula",
          "role": "Affiliated to",
          "text": "The Haryana State Board of Technical Education conducts the examinations and awards the diplomas."
        },
        {
          "by": "DTE Haryana",
          "role": "Recognised by",
          "text": "The Directorate of Technical Education, Haryana, approves the courses and supports the institute with grant-in-aid."
        }
      ],
      "glance": [
        {
          "authority": "AICTE",
          "purpose": "Approval of programmes and intake",
          "document": "Extension of Approval, 2025-26"
        },
        {
          "authority": "HSBTE",
          "purpose": "Affiliation and examinations",
          "document": "Affiliation, 2024-25"
        },
        {
          "authority": "Institute",
          "purpose": "Public information under RTI",
          "document": "Mandatory Disclosure, 2025"
        }
      ]
    }
  },
  {
    "key": "alumni",
    "content": {
      "key": "alumni",
      "hero": {
        "image": "/images/pages-banner.png"
      },
      "intro": {
        "eyebrow": "About us",
        "title": "Alumni",
        "lead": "Once a Chhotu Ram student, always part of the family."
      },
      "welcome": "Our alumni are a diverse group who have achieved notable things in their personal and professional lives. Their messages and contributions keep the next batches moving forward.",
      "doors": [
        {
          "title": "Alumni messages",
          "text": "Read what former students have to say about their years here and where life took them."
        },
        {
          "title": "Contributions",
          "text": "See how alumni have given back to the institute and its students."
        }
      ],
      "voices": [
        {
          "name": "Alumnus name",
          "batch": "Batch year, Civil Engineering",
          "quote": "The workshop and my teachers gave me the confidence to start work from day one."
        },
        {
          "name": "Alumnus name",
          "batch": "Batch year, Electrical Engineering",
          "quote": "What I learned here is still what I use on site every day."
        },
        {
          "name": "Alumnus name",
          "batch": "Batch year, Mechanical Engineering",
          "quote": "Industrial visits and the placement cell opened my first job for me."
        }
      ],
      "messages": [
        {
          "name": "Alumnus name",
          "batch": "Batch year, Computer Engineering",
          "quote": "The friendships and practical lessons from campus continue to inspire my work."
        },
        {
          "name": "Alumna name",
          "batch": "Batch year, Electronics & Communication",
          "quote": "My time here gave me the confidence to take on new challenges."
        }
      ],
      "contributions": [
        "Sharing career guidance and mentorship with current students.",
        "Supporting workshops, laboratories and learning resources.",
        "Connecting students with internships and industry opportunities."
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
