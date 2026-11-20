
class CommunityMember {
  constructor(
    protected memberId: string,
    public fullName: string,
    public contactEmail: string,
  ) {}

  introduce(): void {
    console.log(
      `Hi! I'm ${this.fullName}. You can contact me at ${this.contactEmail}`,
    );
  }
}

class Learner extends CommunityMember {
  constructor(
    id: string,
    name: string,
    email: string,
    public fieldOfStudy: string,
  ) {
    super(id, name, email);
  }

  attendClass(): void {
    console.log(`${this.fullName} is learning ${this.fieldOfStudy}`);
  }
}

class Instructor extends CommunityMember {
  constructor(
    id: string,
    name: string,
    email: string,
    public courseName: string,
  ) {
    super(id, name, email);
  }

  deliverLesson(): void {
    console.log(`${this.fullName} is teaching ${this.courseName}`);
  }
}

class Coordinator extends CommunityMember {
  constructor(
    id: string,
    name: string,
    email: string,
    public workingUnit: string,
  ) {
    super(id, name, email);
  }

  performDuties(): void {
    console.log(
      `${this.fullName} is responsible for the ${this.workingUnit} unit`,
    );
  }
}

// Create a learner
const learner = new Learner(
  "L001",
  "Alex Nguyen",
  "alex.nguyen@gmail.com",
  "Software Engineering",
);
learner.introduce();
learner.attendClass();

// Create an instructor
const instructor = new Instructor(
  "I001",
  "David Tran",
  "david.tran@gmail.com",
  "Database Management",
);
instructor.introduce();
instructor.deliverLesson();

// Create a coordinator
const coordinator = new Coordinator(
  "C001",
  "Emily Pham",
  "emily.pham@gmail.com",
  "Academic Affairs",
);
coordinator.introduce();
coordinator.performDuties();
