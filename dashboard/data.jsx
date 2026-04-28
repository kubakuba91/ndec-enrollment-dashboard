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
  // ─── Other 49 states + DC ─────────────────────────────────────────────────
  { city:'Birmingham',       zip:'35203', county:'Jefferson',           state:'AL', lat:33.5186, lng:-86.8104,  pg:null },
  { city:'Anchorage',        zip:'99501', county:'Anchorage',           state:'AK', lat:61.2181, lng:-149.9003, pg:null },
  { city:'Phoenix',          zip:'85001', county:'Maricopa',            state:'AZ', lat:33.4484, lng:-112.0740, pg:null },
  { city:'Tucson',           zip:'85701', county:'Pima',                state:'AZ', lat:32.2226, lng:-110.9747, pg:null },
  { city:'Little Rock',      zip:'72201', county:'Pulaski',             state:'AR', lat:34.7465, lng:-92.2896,  pg:null },
  { city:'Los Angeles',      zip:'90001', county:'Los Angeles',         state:'CA', lat:34.0522, lng:-118.2437, pg:null },
  { city:'San Francisco',    zip:'94102', county:'San Francisco',       state:'CA', lat:37.7749, lng:-122.4194, pg:null },
  { city:'San Diego',        zip:'92101', county:'San Diego',           state:'CA', lat:32.7157, lng:-117.1611, pg:null },
  { city:'Sacramento',       zip:'95814', county:'Sacramento',          state:'CA', lat:38.5816, lng:-121.4944, pg:null },
  { city:'Denver',           zip:'80202', county:'Denver',              state:'CO', lat:39.7392, lng:-104.9903, pg:null },
  { city:'Colorado Springs', zip:'80903', county:'El Paso',             state:'CO', lat:38.8339, lng:-104.8214, pg:null },
  { city:'Hartford',         zip:'06103', county:'Hartford',            state:'CT', lat:41.7637, lng:-72.6851,  pg:null },
  { city:'New Haven',        zip:'06510', county:'New Haven',           state:'CT', lat:41.3083, lng:-72.9279,  pg:null },
  { city:'Wilmington',       zip:'19801', county:'New Castle',          state:'DE', lat:39.7391, lng:-75.5398,  pg:null },
  { city:'Washington',       zip:'20001', county:'District of Columbia',state:'DC', lat:38.9072, lng:-77.0369,  pg:null },
  { city:'Miami',            zip:'33130', county:'Miami-Dade',          state:'FL', lat:25.7617, lng:-80.1918,  pg:null },
  { city:'Tampa',            zip:'33602', county:'Hillsborough',        state:'FL', lat:27.9506, lng:-82.4572,  pg:null },
  { city:'Jacksonville',     zip:'32202', county:'Duval',               state:'FL', lat:30.3322, lng:-81.6557,  pg:null },
  { city:'Orlando',          zip:'32801', county:'Orange',              state:'FL', lat:28.5383, lng:-81.3792,  pg:null },
  { city:'Atlanta',          zip:'30303', county:'Fulton',              state:'GA', lat:33.7490, lng:-84.3880,  pg:null },
  { city:'Savannah',         zip:'31401', county:'Chatham',             state:'GA', lat:32.0809, lng:-81.0912,  pg:null },
  { city:'Honolulu',         zip:'96813', county:'Honolulu',            state:'HI', lat:21.3069, lng:-157.8583, pg:null },
  { city:'Boise',            zip:'83702', county:'Ada',                 state:'ID', lat:43.6150, lng:-116.2023, pg:null },
  { city:'Chicago',          zip:'60601', county:'Cook',                state:'IL', lat:41.8781, lng:-87.6298,  pg:null },
  { city:'Springfield',      zip:'62701', county:'Sangamon',            state:'IL', lat:39.7817, lng:-89.6501,  pg:null },
  { city:'Indianapolis',     zip:'46204', county:'Marion',              state:'IN', lat:39.7684, lng:-86.1581,  pg:null },
  { city:'Des Moines',       zip:'50309', county:'Polk',                state:'IA', lat:41.5868, lng:-93.6250,  pg:null },
  { city:'Wichita',          zip:'67202', county:'Sedgwick',            state:'KS', lat:37.6872, lng:-97.3301,  pg:null },
  { city:'Louisville',       zip:'40202', county:'Jefferson',           state:'KY', lat:38.2527, lng:-85.7585,  pg:null },
  { city:'New Orleans',      zip:'70112', county:'Orleans',             state:'LA', lat:29.9511, lng:-90.0715,  pg:null },
  { city:'Baton Rouge',      zip:'70801', county:'East Baton Rouge',    state:'LA', lat:30.4515, lng:-91.1871,  pg:null },
  { city:'Baltimore',        zip:'21202', county:'Baltimore City',      state:'MD', lat:39.2904, lng:-76.6122,  pg:null },
  { city:'Boston',           zip:'02110', county:'Suffolk',             state:'MA', lat:42.3601, lng:-71.0589,  pg:null },
  { city:'Cambridge',        zip:'02138', county:'Middlesex',           state:'MA', lat:42.3736, lng:-71.1097,  pg:null },
  { city:'Detroit',          zip:'48226', county:'Wayne',               state:'MI', lat:42.3314, lng:-83.0458,  pg:null },
  { city:'Ann Arbor',        zip:'48104', county:'Washtenaw',           state:'MI', lat:42.2808, lng:-83.7430,  pg:null },
  { city:'Minneapolis',      zip:'55401', county:'Hennepin',            state:'MN', lat:44.9778, lng:-93.2650,  pg:null },
  { city:'Jackson',          zip:'39201', county:'Hinds',               state:'MS', lat:32.2988, lng:-90.1848,  pg:null },
  { city:'St. Louis',        zip:'63101', county:'St. Louis City',      state:'MO', lat:38.6270, lng:-90.1994,  pg:null },
  { city:'Kansas City',      zip:'64108', county:'Jackson',             state:'MO', lat:39.0997, lng:-94.5786,  pg:null },
  { city:'Billings',         zip:'59101', county:'Yellowstone',         state:'MT', lat:45.7833, lng:-108.5007, pg:null },
  { city:'Omaha',            zip:'68102', county:'Douglas',             state:'NE', lat:41.2565, lng:-95.9345,  pg:null },
  { city:'Las Vegas',        zip:'89101', county:'Clark',               state:'NV', lat:36.1699, lng:-115.1398, pg:null },
  { city:'Reno',             zip:'89501', county:'Washoe',              state:'NV', lat:39.5296, lng:-119.8138, pg:null },
  { city:'Manchester',       zip:'03101', county:'Hillsborough',        state:'NH', lat:42.9956, lng:-71.4548,  pg:null },
  { city:'Newark',           zip:'07102', county:'Essex',               state:'NJ', lat:40.7357, lng:-74.1724,  pg:null },
  { city:'Jersey City',      zip:'07302', county:'Hudson',              state:'NJ', lat:40.7178, lng:-74.0431,  pg:null },
  { city:'Albuquerque',      zip:'87102', county:'Bernalillo',          state:'NM', lat:35.0844, lng:-106.6504, pg:null },
  { city:'New York',         zip:'10001', county:'New York',            state:'NY', lat:40.7128, lng:-74.0060,  pg:null },
  { city:'Buffalo',          zip:'14202', county:'Erie',                state:'NY', lat:42.8864, lng:-78.8784,  pg:null },
  { city:'Albany',           zip:'12207', county:'Albany',              state:'NY', lat:42.6526, lng:-73.7562,  pg:null },
  { city:'Charlotte',        zip:'28202', county:'Mecklenburg',         state:'NC', lat:35.2271, lng:-80.8431,  pg:null },
  { city:'Raleigh',          zip:'27601', county:'Wake',                state:'NC', lat:35.7796, lng:-78.6382,  pg:null },
  { city:'Fargo',            zip:'58102', county:'Cass',                state:'ND', lat:46.8772, lng:-96.7898,  pg:null },
  { city:'Cleveland',        zip:'44113', county:'Cuyahoga',            state:'OH', lat:41.4993, lng:-81.6944,  pg:null },
  { city:'Columbus',         zip:'43215', county:'Franklin',            state:'OH', lat:39.9612, lng:-82.9988,  pg:null },
  { city:'Oklahoma City',    zip:'73102', county:'Oklahoma',            state:'OK', lat:35.4676, lng:-97.5164,  pg:null },
  { city:'Portland',         zip:'97204', county:'Multnomah',           state:'OR', lat:45.5152, lng:-122.6784, pg:null },
  { city:'Philadelphia',     zip:'19103', county:'Philadelphia',        state:'PA', lat:39.9526, lng:-75.1652,  pg:null },
  { city:'Pittsburgh',       zip:'15222', county:'Allegheny',           state:'PA', lat:40.4406, lng:-79.9959,  pg:null },
  { city:'Providence',       zip:'02903', county:'Providence',          state:'RI', lat:41.8240, lng:-71.4128,  pg:null },
  { city:'Charleston',       zip:'29401', county:'Charleston',          state:'SC', lat:32.7765, lng:-79.9311,  pg:null },
  { city:'Columbia',         zip:'29201', county:'Richland',            state:'SC', lat:34.0007, lng:-81.0348,  pg:null },
  { city:'Sioux Falls',      zip:'57104', county:'Minnehaha',           state:'SD', lat:43.5446, lng:-96.7311,  pg:null },
  { city:'Nashville',        zip:'37203', county:'Davidson',            state:'TN', lat:36.1627, lng:-86.7816,  pg:null },
  { city:'Memphis',          zip:'38103', county:'Shelby',              state:'TN', lat:35.1495, lng:-90.0490,  pg:null },
  { city:'Houston',          zip:'77002', county:'Harris',              state:'TX', lat:29.7604, lng:-95.3698,  pg:null },
  { city:'Dallas',           zip:'75201', county:'Dallas',              state:'TX', lat:32.7767, lng:-96.7970,  pg:null },
  { city:'Austin',           zip:'78701', county:'Travis',              state:'TX', lat:30.2672, lng:-97.7431,  pg:null },
  { city:'San Antonio',      zip:'78205', county:'Bexar',               state:'TX', lat:29.4241, lng:-98.4936,  pg:null },
  { city:'Salt Lake City',   zip:'84101', county:'Salt Lake',           state:'UT', lat:40.7608, lng:-111.8910, pg:null },
  { city:'Burlington',       zip:'05401', county:'Chittenden',          state:'VT', lat:44.4759, lng:-73.2121,  pg:null },
  { city:'Richmond',         zip:'23219', county:'Richmond City',       state:'VA', lat:37.5407, lng:-77.4360,  pg:null },
  { city:'Virginia Beach',   zip:'23451', county:'Virginia Beach City', state:'VA', lat:36.8529, lng:-75.9780,  pg:null },
  { city:'Seattle',          zip:'98101', county:'King',                state:'WA', lat:47.6062, lng:-122.3321, pg:null },
  { city:'Spokane',          zip:'99201', county:'Spokane',             state:'WA', lat:47.6588, lng:-117.4260, pg:null },
  { city:'Charleston',       zip:'25301', county:'Kanawha',             state:'WV', lat:38.3498, lng:-81.6326,  pg:null },
  { city:'Milwaukee',        zip:'53202', county:'Milwaukee',           state:'WI', lat:43.0389, lng:-87.9065,  pg:null },
  { city:'Madison',          zip:'53703', county:'Dane',                state:'WI', lat:43.0731, lng:-89.4012,  pg:null },
  { city:'Cheyenne',         zip:'82001', county:'Laramie',             state:'WY', lat:41.1399, lng:-104.8197, pg:null },
];
const ME_LOCATIONS = LOCATIONS.filter(l => l.state === 'ME');

const FIRST = ['Mary','James','Linda','Robert','Patricia','John','Barbara','Michael','Susan','William','Jessica','David','Karen','Richard','Nancy','Joseph','Lisa','Thomas','Betty','Charles','Margaret','Christopher','Sandra','Daniel','Ashley','Matthew','Dorothy','Anthony','Kimberly','Mark','Emily','Donald','Donna','Steven','Michelle','Paul','Carol','Andrew','Amanda','Joshua','Melissa','Kenneth','Deborah','Kevin','Stephanie','Brian','Rebecca','George','Laura','Edward','Helen','Dennis','Ruth','Harold','Sharon','Jerry','Cynthia','Arthur','Kathleen','Lawrence','Amy'];
const LAST  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Phillips','Evans','Turner','Parker','Collins','Edwards','Stewart','Morris','Rogers','Reed','Cook','Morgan','Bell','Murphy','Bailey'];
const DEVICES = ['iPhone','Android Phone','iPad','Android Tablet','Windows PC','Mac','Chromebook'];
const EXPERIENCE = ['Just getting started','Some experience','Comfortable, want more'];
const ONBOARDING_Q3 = ['Yes – interested in affordable internet options', 'No – not needed right now'];
const SPONSOR_STATUSES = ['Active','Pending Verification','Approved','Waitlisted'];
const CLASS_FORMATS = ['Live Online','On Demand','Both Available'];
const RACE_OPTIONS = ['White','Black or African American','Hispanic or Latino','Asian','American Indian or Alaska Native','Native Hawaiian or Other Pacific Islander','Two or More Races','Prefer not to say'];

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
    const loc  = rng.bool(0.5) ? rng.pick(ME_LOCATIONS) : rng.pick(LOCATIONS);
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
    const race          = loc.pg === 'lincoln' ? rng.pick(RACE_OPTIONS) : null;

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
      state:         loc.state,
      zip:           loc.zip,
      lat:           loc.lat + rng.jitter(0.05),
      lng:           loc.lng + rng.jitter(0.05),
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
        race:              race,
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
  const loc   = rng.bool(0.5) ? rng.pick(ME_LOCATIONS) : rng.pick(LOCATIONS);
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
    state:         loc.state,
    zip:           loc.zip,
    lat:           loc.lat + rng.jitter(0.05),
    lng:           loc.lng + rng.jitter(0.05),
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
      race:             loc.pg === 'lincoln' ? rng.pick(RACE_OPTIONS) : null,
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
