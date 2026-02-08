import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type JobSource = {
    #linkedin;
    #indeed;
    #workday;
    #companySite;
    #other;
  };

  public type Job = {
    id : Nat;
    title : Text;
    company : Text;
    location : Text;
    description : Text;
    source : JobSource;
    postedTime : Time.Time;
  };

  public type SavedJob = {
    jobId : Nat;
    savedTime : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    preferredLocations : [Text];
  };

  let jobs = Map.empty<Nat, Job>();
  let userSavedJobs = Map.empty<Principal, List.List<SavedJob>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextJobId = 1;

  let allowedCompanies = [
    "Pfizer",
    "Johnson & Johnson",
    "Sinopharm",
    "Roche",
    "Merck & Co.",
    "AbbVie",
    "Bayer",
    "Novartis",
    "Sanofi",
    "Bristol Myers Squibb",
    "AstraZeneca",
    "Abbott Laboratories",
    "GSK",
    "Takeda",
    "Eli Lilly",
    "Gilead Sciences",
    "Amgen",
    "Boehringer Ingelheim",
    "Novo Nordisk",
    "Merck Group",
    "Siemens Healthcare",
    "Moderna",
    "BioNTech",
    "Jointown Pharmaceuticals",
    "GE Healthcare",
    "Viatris",
    "Baxter International",
    "Teva Pharmaceuticals",
    "Haleon",
    "Cipla",
    "Aurobindo",
    "Alembic",
    "Lupin",
    "Glenmark",
    "Sun Pharma",
    "Biological E",
    "Sandoz",
    "Hetero",
    "Mylan",
    "Biophore",
    "Biocon",
    "Torrent",
    "Dr. Reddy's",
    "Divi's",
    "Mankind",
    "Gland Pharma",
    "Intas",
    "Bharat Biotech",
    "Emcure",
    "Piramal",
    "Alkem",
    "Laurus Labs",
    "Bal Pharma",
    "Par Pharma",
    "Ferring Pharmaceuticals",
    "Jamp Pharma",
    "Ipca",
    "Natco",
    "Accenture",
    "TCS",
    "Wipro",
    "Cognizant",
  ];

  let allowedKeywords = [
    "Quality Specialist",
    "QMS",
    "Market Complaints",
    "Product Compliance",
    "Complaint Handling",
    "Investigation",
    "Deviation",
    "GMP",
    "Regulatory Compliance",
    "Change Control",
    "Stability",
    "Risk Assessment",
    "Executive",
    "Senior Executive",
    "Specialist",
    "Corporate quality assurance",
    "Audit Compliance",
  ];

  let allowedLocations = [
    "Mumbai",
    "Hyderabad",
    "Bangalore",
    "Pune",
    "Delhi NCR",
    "Bhubaneswar",
  ];

  func isAllowedCompany(company : Text) : Bool {
    allowedCompanies.values().any(
      func(allowed) {
        Text.equal(
          allowed.toLower(),
          company.toLower(),
        );
      }
    );
  };

  func containsAllowedKeyword(title : Text) : Bool {
    allowedKeywords.values().any(
      func(keyword) {
        title.toLower().contains(#text(keyword.toLower()));
      }
    );
  };

  func isAllowedLocation(location : Text) : Bool {
    allowedLocations.values().any(
      func(allowed) {
        Text.equal(
          allowed.toLower(),
          location.toLower(),
        );
      }
    );
  };

  public shared ({ caller }) func addJob(title : Text, company : Text, location : Text, description : Text, source : JobSource) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add jobs");
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let job : Job = {
      id = jobId;
      title;
      company;
      location;
      description;
      source;
      postedTime = Time.now();
    };

    jobs.add(jobId, job);
    jobId;
  };

  public query ({ caller }) func shouldIncludeJob(company : Text, jobTitle : Text, location : Text) : async Bool {
    let companyCheck = isAllowedCompany(company);
    let keywordCheck = containsAllowedKeyword(jobTitle);
    let locationCheck = isAllowedLocation(location);

    companyCheck and keywordCheck and locationCheck;
  };

  public query ({ caller }) func searchJobs(searchTerm : Text, location : Text) : async [Nat] {
    let filteredJobs = jobs.values().toArray().filter(
      func(job) {
        (job.title.toLower().contains(#text(searchTerm.toLower())) or job.company.toLower().contains(#text(searchTerm.toLower())))
        and job.location.toLower().contains(#text(location.toLower()))
      }
    );

    let sortedJobs = filteredJobs.sort(
      func(a, b) {
        if (a.postedTime > b.postedTime) { return (#less) };
        if (a.postedTime < b.postedTime) { return (#greater) };
        #equal;
      }
    );

    sortedJobs.map(func(job) { job.id });
  };

  public query ({ caller }) func getAllJobsIds() : async [Nat] {
    jobs.keys().toArray();
  };

  public query ({ caller }) func getJob(id : Nat) : async Job {
    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) { job };
    };
  };

  public shared ({ caller }) func saveJob(jobId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save jobs");
    };

    let savedJobs = switch (userSavedJobs.get(caller)) {
      case (null) { List.empty<SavedJob>() };
      case (?list) { list };
    };

    let savedJob : SavedJob = {
      jobId;
      savedTime = Time.now();
    };

    savedJobs.add(savedJob);
    userSavedJobs.add(caller, savedJobs);
  };

  public query ({ caller }) func getSavedJobIds() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saved jobs");
    };

    switch (userSavedJobs.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray().map(func(savedJob) { savedJob.jobId }) };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
