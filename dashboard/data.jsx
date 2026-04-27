// NDEC Dashboard — Mock Data Layer (v2 — expanded fields)
(function () {

const PARTNER_GROUPS = [
  { id: 'lincoln',   name: 'Lincoln County Partnership',         color: '#3b82f6', abbr: 'LCP'  },
  { id: 'portland',  name: 'Greater Portland Digital Access',    color: '#a78bfa', abbr: 'GPDA' },
  { id: 'penobscot', name: 'Penobscot Valley Digital Inclusion', color: '#22d3ee', abbr: 'PVDI' },
  { id: 'western',   name: 'Western Maine Digital Literacy',     color: '#34d399', abbr: 'WMDL' },
  { id: 'downeast',  name: 'Downeast Digital Access',            color: '#fbbf24', abbr: 'DDA'  },
  { id: 'aroostook', name: 'Aroostook County Tech Program',      color: '#fb7185', abbr: 'ACTP' },
];

const CLASSES = [
  { id: 'c01', name: 'Basic Internet Safety',           category: 'Safety'   },
  { id: 'c02', name: 'Identifying Frauds & Scams',      category: 'Safety'   },
  { id: 'c03', name: 'Keeping Online Accounts Safe',    category: 'Safety'   },
  { id: 'c04', name: 'AI Safety',                       category: 'Safety'   },
  { id: 'c05', name: 'Using Facebook Securely',         category: 'Safety'   },
  { id: 'c06', name: 'iPhone Basics',                   category: 'Devices'  },
  { id: 'c07', name: 'Android Basics',                  category: 'Devices'  },
  { id: 'c08', name: 'iPhone Intermediate',             category: 'Devices'  },
  { id: 'c09', name: 'iPad Basics',                     category: 'Devices'  },
  { id: 'c10', name: 'Windows 11 Basics',               category: 'Devices'  },
  { id: 'c11', name: 'MacOS Basics',                    category: 'Devices'  },
  { id: 'c12', name: 'Chromebook Basics',               category: 'Devices'  },
  { id: 'c13', name: 'Internet Basics',                 category: 'Internet' },
  { id: 'c14', name: 'All About Devices',               category: 'Internet' },
  { id: 'c15', name: 'Exploring Affordable Internet',   category: 'Internet' },
  { id: 'c16', name: 'Cutting the Cord',                category: 'Internet' },
  { id: 'c17', name: 'Using Gmail Effectively',         category: 'Apps'     },
  { id: 'c18', name: 'Telehealth',                      category: 'Apps'     },
  { id: 'c19', name: 'Word Basics',                     category: 'Apps'     },
  { id: 'c20', name: 'Excel Basics',                    category: 'Apps'     },
  { id: 'c21', name: 'Google Docs',                     category: 'Apps'     },
  { id: 'c22', name: 'AI for Job Seekers',              category: 'Apps'     },
  { id: 'c23', name: 'Cloud Library',                   category: 'Apps'     },
  { id: 'c24', name: 'WordPress Basics',                category: 'Apps'     },
];

const GOALS = [
  'Feel safer and more confident online',
  'Get more comfortable using my device',
  'Understand how the internet works',
  'Do more with specific apps or software',
];

const LOCATIONS = [
  { city:'Portland',       zip:'04101', county:'Cumberland', state:'ME', lat:43.6591, lng:-70.2568, pg:'portland'  },
  { city:'South Portland', zip:'04106', county:'Cumberland', state:'ME', lat:43.6414, lng:-70.2412, pg:'portland'  },
  { city:'Scarborough',    zip:'04074', county:'Cumberland', state:'ME', lat:43.5781, lng:-70.3220, pg:'portland'  },
  { city:'Westbrook',      zip:'04092', county:'Cumberland', state:'ME', lat:43.6770, lng:-70.3712, pg:'portland'  },
  { city:'Brunswick',      zip:'04011', county:'Cumberland', state:'ME', lat:43.9136, lng:-69.9658, pg:'portland'  },
  { city:'Bangor',         zip:'04401', county:'Penobscot',    state:'ME', lat:44.8016, lng:-68.7712, pg:'penobscot' },
  { city:'Brewer',         zip:'04412', county:'Penobscot',    state:'ME', lat:44.7959, lng:-68.7595, pg:'penobscot' },
  { city:'Old Town',       zip:'04468', county:'Penobscot',    state:'ME', lat:44.9341, lng:-68.6453, pg:'penobscot' },
  { city:'Orono',          zip:'04473', county:'Penobscot',    state:'ME', lat:44.8834, lng:-68.6722, pg:'penobscot' },
  { city:'Augusta',        zip:'04330', county:'Kennebec',     state:'ME', lat:44.3106, lng:-69.7795, pg:null        },
  { city:'Waterville',     zip:'04901', county:'Kennebec',     state:'ME', lat:44.5520, lng:-69.6317, pg:null        },
  { city:'Hallowell',      zip:'04347', county:'Kennebec',     state:'ME', lat:44.2862, lng:-69.7898, pg:null        },
  { city:'Lewiston',       zip:'04240', county:'Androscoggin', state:'ME', lat:44.1003, lng:-70.2148, pg:'western'   },
  { city:'Auburn',         zip:'04210', county:'Androscoggin', state:'ME', lat:44.0979, lng:-70.2311, pg:'western'   },
  { city:'Farmington',     zip:'04938', county:'Franklin',     state:'ME', lat:44.6706, lng:-70.1511, pg:'western'   },
  { city:'Norway',         zip:'04268', county:'Oxford',       state:'ME', lat:44.2151, lng:-70.5450, pg:'western'   },
  { city:'Bethel',         zip:'04217', county:'Oxford',       state:'ME', lat:44.4040, lng:-70.7900, pg:'western'   },
  { city:'Rangeley',       zip:'04970', county:'Franklin',     state:'ME', lat:44.9659, lng:-70.6420, pg:'western'   },
  { city:'Bath',           zip:'04530', county:'Sagadahoc',    state:'ME', lat:43.9106, lng:-69.8214, pg:null        },
  { city:'Damariscotta',   zip:'04543', county:'Lincoln',      state:'ME', lat:44.0317, lng:-69.5189, pg:'lincoln'   },
  { city:'Wiscasset',      zip:'04578', county:'Lincoln',      state:'ME', lat:44.0028, lng:-69.6661, pg:'lincoln'   },
  { city:'Waldoboro',      zip:'04572', county:'Lincoln',      state:'ME', lat:44.0973, lng:-69.3753, pg:'lincoln'   },
  { city:'Newcastle',      zip:'04553', county:'Lincoln',      state:'ME', lat:44.0383, lng:-69.5409, pg:'lincoln'   },
  { city:'Boothbay Harbor',zip:'04538', county:'Lincoln',      state:'ME', lat:43.8500, lng:-69.6275, pg:'lincoln'   },
  { city:'Rockland',       zip:'04841', county:'Knox',         state:'ME', lat:44.1037, lng:-69.1089, pg:null        },
  { city:'Camden',         zip:'04843', county:'Knox',         state:'ME', lat:44.2098, lng:-69.0648, pg:null        },
  { city:'Ellsworth',      zip:'04605', county:'Hancock',      state:'ME', lat:44.5431, lng:-68.4197, pg:'downeast'  },
  { city:'Bar Harbor',     zip:'04609', county:'Hancock',      state:'ME', lat:44.3876, lng:-68.2039, pg:'downeast'  },
  { city:'Blue Hill',      zip:'04614', county:'Hancock',      state:'ME', lat:44.4140, lng:-68.5890, pg:'downeast'  },
  { city:'Machias',        zip:'04654', county:'Washington',   state:'ME', lat:44.7148, lng:-67.4615, pg:'downeast'  },
  { city:'Calais',         zip:'04619', county:'Washington',   state:'ME', lat:45.1834, lng:-67.2786, pg:'downeast'  },
  { city:'Eastport',       zip:'04631', county:'Washington',   state:'ME', lat:44.9069, lng:-66.9842, pg:'downeast'  },
  { city:'Presque Isle',   zip:'04769', county:'Aroostook',    state:'ME', lat:46.6814, lng:-68.0156, pg:'aroostook' },
  { city:'Houlton',        zip:'04730', county:'Aroostook',    state:'ME', lat:46.1264, lng:-67.8403, pg:'aroostook' },
  { city:'Fort Kent',      zip:'04743', county:'Aroostook',    state:'ME', lat:47.2581, lng:-68.5894, pg:'aroostook' },
  { city:'Caribou',        zip:'04736', county:'Aroostook',    state:'ME', lat:46.8606, lng:-68.0117, pg:'aroostook' },
  { city:'Saco',           zip:'04072', county:'York',         state:'ME', lat:43.5009, lng:-70.4428, pg:null        },
  { city:'Biddeford',      zip:'04005', county:'York',         state:'ME', lat:43.4926, lng:-70.4533, pg:null        },
  { city:'Kennebunk',      zip:'04043', county:'York',         state:'ME', lat:43.3842, lng:-70.5436, pg:null        },
  { city:'Skowhegan',      zip:'04976', county:'Somerset',     state:'ME', lat:44.7650, lng:-69.7184, pg:null        },
];

const FIRST = ['Mary','James','Linda','Robert','Patricia','John','Barbara','Michael','Susan','William','Jessica','David','Karen','Richard','Nancy','Joseph','Lisa','Thomas','Betty','Charles','Margaret','Christopher','Sandra','Daniel','Ashley','Matthew','Dorothy','Anthony','Kimberly','Mark','Emily','Donald','Donna','Steven','Michelle','Paul','Carol','Andrew','Amanda','Joshua','Melissa','Kenneth','Deborah','Kevin','Stephanie','Brian','Rebecca','George','Laura','Edward','Helen','Dennis','Ruth','Harold','Sharon','Jerry','Cynthia','Arthur','Kathleen','Lawrence','Amy'];
const LAST  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Phillips','Evans','Turner','Parker','Collins','Edwards','Stewart','Morris','Rogers','Reed','Cook','Morgan','Bell','Murphy','Bailey'];
const DEVICES = ['iPhone','Android Phone','iPad','Android Tablet','Windows PC','Mac','Chromebook'];
const EXPERIENCE = ['Just getting started','Some experience','Comfortable, want more'];
const ONBOARDING_Q3 = ['Yes – interested in affordable internet options', 'No – not needed right now'];
const SPONSOR_STATUSES = ['Active','Pending Verification','Approved','Waitlisted'];
const CLASS_FORMATS = ['Live Online','On Demand','Both Available'];

class Rng {
  constructor(s) { this.s = s >>> 0; }
  next() { this.s = (Math.imul(this.s, 1664525) + 1013904223) >>> 0; return this.s / 4294967296; }
  int(n)  { return Math.floor(this.next() * n); }
  pick(a) { return a[this.int(a.length)]; }
  bool(p) { return this.next() < p; }
  jitter(n) { return (this.next() - 0.5) * n; }
}

function makeUsername(first, last, rng) {
  const styles = [
    () => `${first.toLowerCase()}.${last.toLowerCase()}`,
    () => `${first.toLowerCase()}${last.toLowerCase().slice(0,3)}${rng.int(99)+1}`,
    () => `${first[0].toLowerCase()}${last.toLowerCase()}`,
    () => `${first.toLowerCase()}${rng.int(999)+1}`,
  ];
  return rng.pick(styles)();
}

function makeEmail(username, rng) {
  const domains = ['gmail.com','yahoo.com','outlook.com','mainestate.gov','icloud.com','comcast.net','roadrunner.com'];
  return `${username}@${rng.pick(domains)}`;
}

function makeRecommendedClasses(goal, device, rng, CLASSES) {
  const byGoal = {
    'Feel safer and more confident online':          ['c01','c02','c03','c04','c05'],
    'Get more comfortable using my device':          ['c06','c07','c08','c09','c10','c11','c12'],
    'Understand how the internet works':             ['c13','c14','c15','c16'],
    'Do more with specific apps or software':        ['c17','c18','c19','c20','c21','c22','c23','c24'],
  };
  const pool = byGoal[goal] || ['c01','c13'];
  const n    = rng.int(2) + 2;
  const out  = [];
  const copy = [...pool];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(rng.int(copy.length),1)[0]);
  }
  return out.map(id => CLASSES.find(c => c.id === id)).filter(Boolean);
}

function generateSignups(count = 148) {
  const rng  = new Rng(7331);
  const now  = new Date('2026-04-24T10:00:00');
  const records = [];

  for (let i = 0; i < count; i++) {
    const loc  = rng.pick(LOCATIONS);
    const pg   = loc.pg ? PARTNER_GROUPS.find(g => g.id === loc.pg) : null;

    const firstName   = rng.pick(FIRST);
    const lastName    = rng.pick(LAST);
    const username    = makeUsername(firstName, lastName, rng);
    const email       = makeEmail(username, rng);
    const displayName = `${firstName} ${lastName}`;
    const goal        = rng.pick(GOALS);
    const device      = rng.pick(DEVICES);
    const experience  = rng.pick(EXPERIENCE);
    const hasInternet = rng.bool(0.68);
    const interestedInAffordable = !hasInternet ? rng.pick(ONBOARDING_Q3) : null;
    const householdSize = loc.pg === 'lincoln' ? rng.int(5) + 1 : null;

    const recommended = makeRecommendedClasses(goal, device, rng, CLASSES);
    const numEnrolled = rng.int(Math.min(recommended.length, 3)) + 1;
    const enrolledPool = [...recommended];
    const enrolledClasses = [];
    const daysAgo = rng.int(30);
    const registeredMs = now - daysAgo * 86400000 - rng.next() * 86400000;

    for (let c = 0; c < numEnrolled && enrolledPool.length; c++) {
      const cls = enrolledPool.splice(rng.int(enrolledPool.length), 1)[0];
      const enrollOffset = rng.int(daysAgo * 86400000 / 1000) * 1000;
      enrolledClasses.push({
        ...cls,
        enrolledDate: new Date(registeredMs + enrollOffset),
        format: rng.pick(CLASS_FORMATS),
        completed: rng.bool(0.35),
      });
    }

    const lastLoginMs = registeredMs + rng.next() * (now - registeredMs);

    const sponsorship = pg ? {
      programName:    pg.name,
      sponsorCode:    `${pg.abbr}-${String(i+1001).padStart(4,'0')}`,
      status:         rng.pick(SPONSOR_STATUSES),
      eligibleFree:   rng.bool(0.78),
      householdSize:  householdSize || (rng.int(5) + 1),
      verifiedDate:   daysAgo < 7 ? null : new Date(registeredMs + rng.int(3) * 86400000),
      notes:          rng.bool(0.2) ? 'Requires follow-up' : null,
    } : null;

    records.push({
      id:            i + 1,
      user_login:    username,
      user_email:    email,
      display_name:  displayName,
      first_name:    firstName,
      last_name:     lastName,
      town:          loc.city,
      county:        loc.county,
      state:         'ME',
      zip:           loc.zip,
      mapX:          loc.x + rng.jitter(5),
      mapY:          loc.y + rng.jitter(5),
      user_registered: new Date(registeredMs),
      last_login:    new Date(lastLoginMs),
      onboarding: {
        q1_zip:            loc.zip,
        q1_partner_check:  !!pg,
        q2_internet_home:  hasInternet,
        q3_affordable_interest: interestedInAffordable,
        main_goal:         goal,
        device_type:       device,
        experience_level:  experience,
        household_size:    householdSize,
      },
      classesRecommended: recommended,
      classesEnrolled:    enrolledClasses,
      partnerGroup:  pg,
      sponsorship,
      isActive:      rng.bool(0.74),
      isNew:         false,
    });
  }

  return records;
}

function makeNewSignup(existingCount) {
  const rng   = new Rng(Date.now() & 0xffffffff);
  const FIRST2= ['Alice','Carlos','Diane','Frank','Gloria','Henry','Irene','Jake','Kathy','Leon','Maria','Neil'];
  const LAST2 = ['Plunkett','Dyer','Sproul','Vose','Hamlin','Belanger','Cyr','Michaud','Roy','Landry'];
  const loc   = rng.pick(LOCATIONS);
  const pg    = loc.pg ? PARTNER_GROUPS.find(g => g.id === loc.pg) : null;
  const firstName = rng.pick(FIRST2);
  const lastName  = rng.pick(LAST2);
  const username  = makeUsername(firstName, lastName, rng);
  const goal      = rng.pick(GOALS);
  const device    = rng.pick(DEVICES);
  const recommended = makeRecommendedClasses(goal, device, rng, CLASSES);
  const now = new Date();
  return {
    id:            existingCount + 1,
    user_login:    username,
    user_email:    makeEmail(username, rng),
    display_name:  `${firstName} ${lastName}`,
    first_name:    firstName,
    last_name:     lastName,
    town:          loc.city,
    county:        loc.county,
    state:         'ME',
    zip:           loc.zip,
    mapX:          loc.x + rng.jitter(5),
    mapY:          loc.y + rng.jitter(5),
    user_registered: now,
    last_login:    now,
    onboarding: {
      q1_zip:           loc.zip,
      q1_partner_check: !!pg,
      q2_internet_home: rng.bool(0.68),
      q3_affordable_interest: null,
      main_goal:        goal,
      device_type:      device,
      experience_level: rng.pick(EXPERIENCE),
      household_size:   loc.pg === 'lincoln' ? rng.int(5)+1 : null,
    },
    classesRecommended: recommended,
    classesEnrolled: [{ ...recommended[0], enrolledDate: now, format: rng.pick(CLASS_FORMATS), completed: false }],
    partnerGroup: pg,
    sponsorship: pg ? {
      programName: pg.name,
      sponsorCode: `${pg.abbr}-${String(existingCount+1001).padStart(4,'0')}`,
      status: 'Pending Verification',
      eligibleFree: rng.bool(0.78),
      householdSize: rng.int(5)+1,
      verifiedDate: null,
      notes: null,
    } : null,
    isActive: true,
    isNew: true,
  };
}

window.NDEC = { PARTNER_GROUPS, CLASSES, GOALS, LOCATIONS, generateSignups, makeNewSignup };
})();
