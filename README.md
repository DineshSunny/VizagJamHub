# 🎸 VizagJamHub

> Development roadmap for the VizagJamHub Music Academy platform.

---

## 📌 Current Development Roadmap

### 🎫 Shows & Concert Tickets

* [ ] Create Show
* [ ] Manage Shows
* [ ] Generate concert tickets
* [ ] Generate QR codes for tickets
* [ ] QR ticket verification / check-in

---

## 🎼 Music Tools

### Chord Library

* [ ] Chord Library
* [ ] Chord Sheet Creator
* [ ] Assign chord sheets to students
* [ ] Student chord-sheet access
* [ ] PDF downloads

### Band Resources

```text
Band Resources
├── Setlists
├── Practice Notes
└── Jam Sessions
```

---

# 🎓 Music School System

## 👨‍🎓 Student Portal

### Student Login

Students should eventually have access to:

* 📝 Notes
* 📄 Download PDFs
* 🎵 Assigned Songs
* 🎼 Chord Sheets
* 🎯 Practice Schedules
* 📢 Class Announcements
* 🎥 Recorded Lessons
* 📅 Upcoming Class
* 🗓️ Complete Class Calendar
* ✅ Attendance
* 📊 Course Progress

---

## 👨‍🏫 Teacher Portal

### Teacher Login

* 📝 Student Notes
* 📤 Upload Resources
* 🎼 Chord Sheet Creator
* 🎯 Practice Tracker
* 🤖 AI Chord Assistant
* 👥 Assigned Students
* ✅ Attendance
* 📈 Student Progress
* 📋 Reports

---

# 🛠️ Admin Dashboard

```text
Admin Dashboard
│
├── Students
│   ├── All Students
│   ├── Search
│   ├── Filters
│   └── Student Profiles
│
├── Teachers
│
├── Classes
│
├── Attendance
│
├── Payments
│
├── Analytics
│
├── Shows
│   ├── Create Show
│   ├── Manage Shows
│   └── Tickets
│
└── Band Resources
    ├── Setlists
    ├── Practice Notes
    └── Jam Sessions
```

---

# 💳 Enrollment System

## Enrollment Flow

```text
Student submits enrollment
        ↓
Razorpay Payment
        ↓
Backend verifies payment
        ↓
Generate Permanent Student ID
        ↓
Automatic Teacher Assignment
        ↓
Generate 8-Week / 24-Class Schedule
        ↓
Save Enrollment
        ↓
Send Confirmation Email
        ↓
registered.html
        ↓
Continue to Student Login
```

### Required Updates

* [ ] Verify Razorpay payment on the **backend**
* [ ] Generate permanent Student ID
* [ ] Save enrollment to `enrollments.json`
* [ ] Automatically assign teacher
* [ ] Generate full class schedule
* [ ] Generate online/in-person access information
* [ ] Send confirmation email
* [ ] Display complete enrollment confirmation

### `registered.html`

After successful enrollment:

* Stay on `registered.html`
* Do **not** redirect back to `index.html`
* Display the student's complete enrollment confirmation
* Display assigned teacher
* Display complete schedule
* Display payment confirmation
* Display access information

**Next action:**

```text
Continue to Student Login → studentlogin.html
```

> [!IMPORTANT]
> `registered.html` should only say that the confirmation email was sent when the backend actually reports successful email delivery.

---

# 🆔 Student ID

Every verified enrollment receives a permanent Student ID.

### Requirements

* Unique
* Permanent
* Generated after verified payment
* Stored with enrollment
* Used for future student authentication

---

# 👨‍🏫 Teachers

Teacher data is temporarily stored in:

```text
teachers.json
```

| Teacher   | Instruments                | Levels     | Format             | Availability                |
| --------- | -------------------------- | ---------- | ------------------ | --------------------------- |
| **Sunny** | Guitar, Bass Guitar        | All Levels | Online / In Person | All Time Slots              |
| **Utej**  | Guitar, Bass Guitar        | Beginner   | Online / In Person | Weekday Evenings + Weekends |
| **Anil**  | Drums, Guitar, Bass Guitar | All Levels | Online / In Person | All Weekday Time Slots      |

### Current Rules

* No maximum-student setting
* No active/inactive setting
* Zoom/classroom links are handled separately
* Classroom links are **not permanently tied to teachers**

---

# 🔄 Automatic Teacher Assignment

The system selects an eligible teacher using:

```text
Instrument
    +
Level
    +
Format
    +
Batch
    +
Class Time
    +
Teacher Availability
    ↓
Eligible Teacher
```

### Example

```text
Beginner
+ Drums
+ Eligible Time
      ↓
     Anil
```

### Storage

Store internally:

```text
teacherId
```

Display:

```text
Teacher Name
```

### History

* [ ] Preserve teacher-assignment history
* [ ] Allow future admin override
* [ ] Never overwrite previous teacher history

---

# 🌐 Online vs. In-Person

## 💻 Online Students

Receive:

* Zoom/classroom link
* Online access instructions

Future support:

* Different rooms by student
* Different rooms by batch
* Different rooms by class/course

## 🏫 In-Person Students

Receive:

* Academy location
* Directions
* Physical classroom assignment when required

### Access Information Appears On

* `registered.html`
* Confirmation email
* Student Dashboard *(later)*

---

# 📅 Class Schedule

Each enrollment generates:

## 8 Weeks · 24 Classes

The existing class structure remains:

| Class Type | Included |
| ---------- | :------: |
| Theory     |     ✅    |
| Practical  |     ✅    |
| Song       |     ✅    |

Schedule generation uses:

* Selected batch
* Selected class time
* Course start date

Initialize:

```text
Total Classes       → 24
Completed Classes   → 0
Attended Classes    → 0
Absent Classes      → 0
Remaining Classes   → 24
```

Student should receive:

* Upcoming class
* Full 8-week calendar
* Theory schedule
* Practical schedule
* Song schedule

---

# 📧 Enrollment Confirmation Email

Send **only after verified payment**.

### Include

* Student Name
* Student ID
* Course / Instrument
* Level
* Format
* Batch
* Class Time
* Theory Schedule
* Practical Schedule
* Song Schedule
* Assigned Teacher
* Amount Paid
* Payment Confirmation
* Student Login Instructions

### 💻 Online

Include:

* Zoom/classroom information
* Online access instructions

### 🏫 In Person

Include:

* Academy location
* Directions

> [!NOTE]
> A failed email delivery must **not** invalidate an otherwise successful enrollment.

---

# 🔐 Student Authentication

> **Later Phase**

## First-Time Setup

```text
Student ID OR Phone Number
          ↓
       Send OTP
          ↓
      Verify OTP
          ↓
    Create Password
          ↓
   Confirm Password
          ↓
 Backend Hashes Password
          ↓
     Account Created
```

### Future Login

```text
Student ID + Password
```

or

```text
Phone Number + Password
```

### Forgot Password

```text
Student ID / Phone
        ↓
      OTP
        ↓
   Verify OTP
        ↓
  New Password
```

> [!CAUTION]
> Passwords must **never** be stored as plain text.

---

# 🔗 Google Login

After initial account creation:

```text
Link Google Account
```

Once linked, students can use Google as an additional login method.

Existing login methods remain available.

---

# 👥 All Students

Main Admin option:

```text
Admin Dashboard
      ↓
  All Students
```

Display a scrollable list of every student.

### Display Format

```text
Dinesh Seveti
VJH-XXXXXXXX

Student Name
Student ID
```

The **student name is the primary display**.

Student ID appears underneath in smaller text.

---

## 🔎 Search & Filters

### Search

* Student Name
* Student ID
* Phone
* Email

### Instrument

* Guitar
* Bass Guitar
* Drums

### Level

* Beginner
* Intermediate
* Advanced

### Batch

* Batch 01
* Batch 02
* Future batches

### Format

* Online
* In Person

### Teacher

* Sunny
* Utej
* Anil
* Future teachers

Clicking a student opens their complete profile.

---

# 📊 Admin Overview

Display:

| Metric               |
| -------------------- |
| Total Students       |
| Guitar Students      |
| Bass Guitar Students |
| Drums Students       |
| Online Students      |
| In-Person Students   |

### Student Grouping

```text
Students
│
├── Guitar
│   ├── Beginner
│   │   ├── Batch 01
│   │   └── Batch 02
│   ├── Intermediate
│   └── Advanced
│
├── Bass Guitar
│   ├── Beginner
│   ├── Intermediate
│   └── Advanced
│
└── Drums
    ├── Beginner
    ├── Intermediate
    └── Advanced
```

Also group by teacher:

```text
Teachers
├── Sunny
│   └── Assigned Students
├── Utej
│   └── Assigned Students
└── Anil
    └── Assigned Students
```

---

# 👤 Student Admin Profile

One student = one complete management page.

## Personal Information

* Name
* Student ID
* Phone
* Email
* Address
* Enrollment Date

## Guardian Information

When applicable:

* Guardian Name
* Relationship
* Phone
* Email

## Emergency Contact

* Name
* Relationship
* Phone

## Course

* Instrument
* Level
* Format
* Batch
* Class Time
* Teacher
* Enrollment Date

## Payment

* Amount
* Payment Status
* Payment Reference
* Payment Date

## Attendance

| Metric        | Value |
| ------------- | ----: |
| Total Classes |    24 |
| Completed     |     — |
| Attended      |     — |
| Absent        |     — |
| Remaining     |     — |
| Attendance %  |     — |

## Progress

* Course Progress
* Instructor Notes *(later)*
* Reports
* Complete Class History

---

# ⚙️ Student Admin Controls

From the Student Profile:

* [ ] Edit student details
* [ ] Change teacher
* [ ] Change batch
* [ ] Change class time
* [ ] In Person → Online
* [ ] Online → In Person
* [ ] Change Zoom/classroom
* [ ] Change physical classroom/location
* [ ] Cancel course

---

# 🕘 Preserve History

> [!IMPORTANT]
> Administrative changes should update the current enrollment **without destroying historical information**.

### Teacher Change

```text
Sunny → Anil
```

Preserve both assignments.

### Batch Change

```text
Batch 01 → Batch 02
```

Preserve the previous batch.

### Format Change

```text
In Person → Online
```

Preserve the previous format.

### Attendance

Past attendance remains connected to the classes that actually occurred.

Changing a batch should affect **future classes**, not rewrite historical attendance.

---

# 🚫 Cancelled Enrollment

Never delete the enrollment.

Instead:

```text
Enrollment Status → Cancelled
```

Preserve:

* Student information
* Payment history
* Attendance
* Completed classes
* Reports
* Teacher history
* Batch history
* Format history
* Admin history
* Cancellation date/reason

---

# 📜 Admin Activity History

Record important administrative changes.

Each entry should contain:

```text
Action
Old Value
New Value
Date / Time
Admin
```

### Example

```text
Teacher
Sunny → Anil
2026-08-28 10:30 AM
```

```text
Format
In Person → Online
2026-08-28 11:15 AM
```

---

# 📈 Student Analytics

Track:

* Total Classes
* Classes Completed
* Classes Attended
* Classes Absent
* Classes Remaining
* Attendance Percentage
* Course Progress
* Instructor Notes
* Reports

Analytics should represent the student's **entire course history**.

---

# 👨‍🏫 Teacher Analytics

> **Later Phase**

Teachers can view:

```text
My Students
├── Course
│   └── Batch
│       └── Students
```

Teachers can:

* Record attendance
* Record progress
* Add notes
* Add reports
* Assign songs
* Assign chord sheets
* Add practice schedules

Admin can view:

* Attendance across teachers
* Student performance
* Teacher assignments
* Course performance
* Batch performance

---

# 💾 Development Storage

For now:

```text
data/
├── enrollments.json
└── teachers.json
```

### Rules

* Continue using JSON during development
* Do **not** Git commit every newly enrolled student
* Treat these files as temporary application data

---

# 🗄️ Production Database

Before production, migrate:

```text
Database
├── Students
├── Enrollments
├── Authentication
├── Payments
├── Teachers
├── Teacher Assignment History
├── Classes
├── Attendance
├── Progress
├── Reports
├── Batch History
├── Format History
├── Admin Activity
├── Classroom Assignments
└── Shows / Tickets
```

> [!IMPORTANT]
> Design the JSON structures now like database records so the eventual migration does **not** require redesigning the application.

---

# 🚀 Implementation Phases

## Phase 1 — Enrollment Foundation

* [ ] Backend Razorpay verification
* [ ] Permanent Student ID
* [ ] `teachers.json`
* [ ] Automatic teacher assignment
* [ ] Teacher history
* [ ] Improved `enrollments.json`
* [ ] 8-week / 24-class schedule
* [ ] Online/In-Person access
* [ ] Complete `registered.html`
* [ ] Verified confirmation email

---

## Phase 2 — Admin System

* [ ] Admin Dashboard
* [ ] All Students
* [ ] Search
* [ ] Filters
* [ ] Student Profile
* [ ] Edit Student
* [ ] Teacher changes
* [ ] Batch changes
* [ ] Time changes
* [ ] Format changes
* [ ] Enrollment history
* [ ] Admin Activity History
* [ ] Cancellation handling
* [ ] Student analytics

---

## Phase 3 — Student Authentication

* [ ] `studentlogin.html`
* [ ] Student ID / phone lookup
* [ ] OTP
* [ ] OTP verification
* [ ] Password creation
* [ ] Password hashing
* [ ] Login
* [ ] Forgot Password
* [ ] Google account linking

---

## Phase 4 — Student Dashboard

* [ ] Notes
* [ ] PDFs
* [ ] Assigned Songs
* [ ] Chord Sheets
* [ ] Practice Schedule
* [ ] Announcements
* [ ] Recorded Lessons
* [ ] Upcoming Class
* [ ] Complete Calendar
* [ ] Attendance
* [ ] Progress

---

## Phase 5 — Teacher Dashboard

* [ ] Teacher Login
* [ ] Assigned Students
* [ ] Attendance
* [ ] Progress Tracking
* [ ] Notes
* [ ] Reports
* [ ] Chord Sheet Creator
* [ ] Practice Tracker
* [ ] AI Chord Assistant

---

## Phase 6 — Shows & Music Tools

* [ ] Create Show
* [ ] Manage Shows
* [ ] Concert Tickets
* [ ] QR Code Generation
* [ ] Ticket Verification
* [ ] Chord Library
* [ ] Setlists
* [ ] Practice Notes
* [ ] Jam Sessions

---

# 🎯 Development Priority

```text
Enrollment
    ↓
Admin System
    ↓
Student Authentication
    ↓
Student Dashboard
    ↓
Teacher Dashboard
    ↓
Shows & Music Tools
    ↓
Production Database
```

**Current Priority → Phase 1: Enrollment Foundation**
