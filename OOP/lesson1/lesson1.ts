
interface DateOfBirth {
  day: number;
  month: number;
  year: number;
}

interface Person {
  id: string;
  name: string;
  phone: string;
  dateOfBirth: DateOfBirth;
}

const calculateAge = (dob: DateOfBirth): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.year;

  const birthdayPassed =
    today.getMonth() + 1 > dob.month ||
    (today.getMonth() + 1 === dob.month &&
      today.getDate() >= dob.day);

  if (!birthdayPassed) age--;

  return age;
};

class Trainer implements Person {
  id: string;
  name: string;
  phone: string;
  dateOfBirth: DateOfBirth;

  private members: Member[] = [];

  constructor(
    person: Person,
    public specialization: string,
    public workingShift: string,
  ) {
    this.id = person.id;
    this.name = person.name;
    this.phone = person.phone;
    this.dateOfBirth = { ...person.dateOfBirth };
  }

  getAge(): number {
    return calculateAge(this.dateOfBirth);
  }

  getMembers(): Member[] {
    return [...this.members];
  }

  hasMember(member: Member): boolean {
    return this.members.includes(member);
  }

  registerMember(member: Member): void {
    if (member.getTrainer() !== null)
      throw new Error(`${member.name} already has a trainer.`);

    if (this.hasMember(member))
      throw new Error(`${member.name} is already registered.`);

    this.members.push(member);
    member.setTrainer(this);
  }

  transferMember(member: Member, newTrainer: Trainer): void {
    if (!this.hasMember(member))
      throw new Error(`${member.name} is not your member.`);

    if (newTrainer === this)
      throw new Error("Cannot transfer to the same trainer.");

    if (newTrainer.hasMember(member))
      throw new Error("Member already exists in the new trainer.");

    newTrainer.members.push(member);
    this.members = this.members.filter((m) => m !== member);
    member.setTrainer(newTrainer);
  }

  findMember(name: string): Member[] {
    const keyword = name.trim().toLowerCase();

    return this.members.filter((member) =>
      member.name.toLowerCase().includes(keyword),
    );
  }

  listMembers(): void {
    if (this.members.length === 0) {
      console.log(`${this.name} has no members.`);
      return;
    }

    console.table(
      this.members.map((member) => ({
        id: member.id,
        name: member.name,
        age: member.getAge(),
        goal: member.getFitnessGoal(),
        plan: member.getWorkoutPlan(),
        status: member.isActive ? "Active" : "Inactive",
      })),
    );
  }

  updateWorkingShift(newShift: string): void {
    this.workingShift = newShift;
  }
}

class Member implements Person {
  id: string;
  name: string;
  phone: string;
  dateOfBirth: DateOfBirth;

  private trainer: Trainer | null = null;
  private workoutPlan: string | null = null;

  isActive: boolean = true;

  constructor(
    person: Person,
    private fitnessGoal: string,
  ) {
    this.id = person.id;
    this.name = person.name;
    this.phone = person.phone;
    this.dateOfBirth = { ...person.dateOfBirth };
  }

  getAge(): number {
    return calculateAge(this.dateOfBirth);
  }

  getTrainer(): Trainer | null {
    return this.trainer;
  }

  setTrainer(trainer: Trainer | null): void {
    this.trainer = trainer;
  }

  getFitnessGoal(): string {
    return this.fitnessGoal;
  }

  setFitnessGoal(newGoal: string): void {
    this.fitnessGoal = newGoal;
  }

  getWorkoutPlan(): string {
    return this.workoutPlan ?? "No workout plan assigned.";
  }

  setWorkoutPlan(plan: string): void {
    if (!this.isActive)
      throw new Error(`${this.name} has an inactive membership.`);

    this.workoutPlan = plan;
  }

  cancelMembership(): void {
    this.isActive = false;
  }

  renewMembership(): void {
    this.isActive = true;
  }
}

// ================= DATA =================

const trainerMike = new Trainer(
  {
    id: "T001",
    name: "Mike",
    phone: "0901111111",
    dateOfBirth: { day: 12, month: 5, year: 1990 },
  },
  "Bodybuilding",
  "Morning",
);

const trainerAnna = new Trainer(
  {
    id: "T002",
    name: "Anna",
    phone: "0902222222",
    dateOfBirth: { day: 20, month: 8, year: 1995 },
  },
  "Yoga",
  "Afternoon",
);

const trainerJohn = new Trainer(
  {
    id: "T003",
    name: "John",
    phone: "0903333333",
    dateOfBirth: { day: 3, month: 2, year: 1988 },
  },
  "Weight Loss",
  "Evening",
);

const memberAlice = new Member(
  {
    id: "M001",
    name: "Alice",
    phone: "0911111111",
    dateOfBirth: { day: 10, month: 4, year: 2000 },
  },
  "Build Muscle",
);

const memberBob = new Member(
  {
    id: "M002",
    name: "Bob",
    phone: "0922222222",
    dateOfBirth: { day: 15, month: 6, year: 1998 },
  },
  "Lose Weight",
);

const memberCharlie = new Member(
  {
    id: "M003",
    name: "Charlie",
    phone: "0933333333",
    dateOfBirth: { day: 25, month: 9, year: 2002 },
  },
  "Improve Flexibility",
);

// ================= DEMO =================

const section = (title: string): void => {
  console.log(`\n========== ${title} ==========`);
};

const expectError = (label: string, callback: () => void): void => {
  try {
    callback();
    console.log(`FAIL: ${label}`);
  } catch (error) {
    console.log(
      `OK: ${label} -> ${
        error instanceof Error ? error.message : error
      }`,
    );
  }
};

// CASE 1: Register members
section("REGISTER MEMBERS");

trainerMike.registerMember(memberAlice);
trainerMike.registerMember(memberBob);
trainerAnna.registerMember(memberCharlie);

trainerMike.listMembers();

// CASE 2: Assign workout plans
section("WORKOUT PLANS");

memberAlice.setWorkoutPlan("Push / Pull / Legs");
memberBob.setWorkoutPlan("Cardio + Full Body");
memberCharlie.setWorkoutPlan("Yoga + Mobility");

trainerMike.listMembers();

// CASE 3: Transfer member
section("TRANSFER MEMBER");

trainerMike.transferMember(memberAlice, trainerAnna);

console.log("Mike's members:");
trainerMike.listMembers();

console.log("Anna's members:");
trainerAnna.listMembers();

// CASE 4: Invalid registration
section("INVALID REGISTRATION");

expectError("Register Alice again", () =>
  trainerJohn.registerMember(memberAlice),
);

// CASE 5: Search members
section("SEARCH MEMBERS");

const results = trainerMike.findMember("bo");

console.table(
  results.map((member) => ({
    id: member.id,
    name: member.name,
  })),
);

// CASE 6: Membership status
section("MEMBERSHIP STATUS");

memberBob.cancelMembership();

expectError("Assign plan to inactive member", () =>
  memberBob.setWorkoutPlan("Heavy Training"),
);

memberBob.renewMembership();
memberBob.setWorkoutPlan("Upper / Lower Split");

console.log("Bob's status:", memberBob.isActive);

// CASE 7: Update trainer schedule
section("UPDATE WORKING SHIFT");

console.log("Before:", trainerMike.workingShift);

trainerMike.updateWorkingShift("Evening");

console.log("After:", trainerMike.workingShift);

// CASE 8: Verify relationships
section("VERIFY RELATIONSHIPS");

const trainers = [trainerMike, trainerAnna, trainerJohn];

for (const trainer of trainers) {
  for (const member of [
    memberAlice,
    memberBob,
    memberCharlie,
  ]) {
    const trainerHasMember = trainer.hasMember(member);
    const memberHasTrainer = member.getTrainer() === trainer;

    if (trainerHasMember !== memberHasTrainer) {
      console.log("Relationship mismatch:", trainer.name, member.name);
    }
  }
}

console.log("Relationship verification completed.");
