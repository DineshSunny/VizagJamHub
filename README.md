# VizagJamHub

UPDATES TO MAKE:


generate QR code concert tickets
Chord Library (easiest)

Student Login
   Login
  View notes
  Download PDFs
View assigned songs
View chord sheets
Practice schedules
Class announcements
Recorded lessons


Teacher Login
Notes Upload
Chord Sheet Creator
Practice Tracker
AI Chord Assistant


Admin Dashboard

Create Show
Manage Shows
Tickets

Band Resources
    ├── Setlists
    ├── Practice Notes
    └── Jam Sessions



Enrollment + School System Updates
Finish successful enrollment
Razorpay payment must be verified by the backend.
Generate a permanent Student ID.
Save the completed enrollment to enrollments.json temporarily.
Keep registered.html open after successful enrollment instead of returning to index.html.
Show the student's complete enrollment confirmation.
Button: Continue to Student Login → studentlogin.html.
Teacher profiles
teachers.json
Sunny — Guitar + Bass Guitar, all levels, online/in-person, all time slots.
Utej — Guitar + Bass Guitar, beginner, online/in-person, weekday evenings + weekends.
Anil — Drums + Guitar + Bass Guitar, all levels, online/in-person, all weekday time slots.
No maximum-student setting for now.
No active/inactive setting.
Zoom/classroom links handled separately rather than permanently tied to one teacher.
Automatic teacher assignment
Program selects an eligible teacher based on instrument, level, format, batch/time and availability.
Beginner Drums currently naturally matches Anil.
Store teacherId internally while displaying the teacher's name.
Preserve teacher-assignment history.
Admin can manually override the automatic teacher selection later.
Online vs. in-person access
Online students receive the correct Zoom/classroom link.
In-person students receive the academy location and directions.
Online rooms can eventually be different for different students/batches.
Access information appears on registered.html and in the confirmation email.
Class schedule
Generate the complete 8-week / 24-class schedule.
Preserve Theory, Practical and Song classes.
Use the student's selected batch and time.
Show upcoming class and complete calendar.
Initialize classes remaining/completed for analytics.
Enrollment confirmation email
Send only after verified payment.
Include student name and Student ID.
Course, level, format, batch and time.
Theory/Practical/Song schedule.
Assigned teacher.
Amount/payment confirmation.
Online → Zoom/classroom information.
In Person → academy location/directions.
Student-login instructions.
registered.html should only claim the email was sent when the backend actually reports successful delivery.
Student login — later phase
First-time student identifies using Student ID or phone number.
Send OTP before allowing password creation.
Verify OTP.
Create Password.
Confirm Password.
Hash password on backend.
Future login with Student ID + password or phone + password.
Forgot Password → OTP → reset password.
After account setup, offer Link Google Account.
Once linked, Google becomes another future login option.
School Admin — All Students
Main admin button: All Students.
Opens a scrollable list containing every student.
Student names are the primary display, not IDs.
Student ID can appear underneath/smaller.
Search students.
Click any student's name to open their complete profile.
Filters for Guitar / Bass Guitar / Drums.
Filters for Beginner / Intermediate / Advanced.
Filters for Batch.
Filters for Online / In Person.
Filters by teacher.
Admin overview
Total students.
Guitar students.
Bass Guitar students.
Drums students.
Online students.
In-person students.
Students grouped by instrument → level → batch.
Students grouped by teacher.
Eventually use these records for overall school analytics.
Single Student Admin Profile
Clicking a student name opens one page containing everything about that student.
Personal information.
Guardian information when applicable.
Emergency contact.
Course.
Level.
Format.
Batch.
Class time.
Teacher.
Enrollment date.
Payment information.
Attendance.
Completed classes.
Remaining classes.
Absences.
Attendance percentage.
Progress/report information.
Complete class history.
Admin controls from that same Student Profile
Edit student details.
Change teacher.
Change batch.
Change class time.
Change In Person → Online.
Change Online → In Person.
Change Zoom/classroom assignment.
Change physical class assignment/location when necessary.
Cancel course.
Other enrollment changes can be added later.
Preserve history when admin changes something
Don't destroy previous information.
Teacher change → teacher history.
Batch change → batch history.
Format change → format history.
Preserve past attendance even if future classes move to another batch.
Cancelled enrollment remains in the system rather than being deleted.
Maintain an Admin Activity History showing what changed, old value → new value, and when.
Student analytics
Total classes.
Classes completed.
Classes attended.
Classes absent.
Classes remaining.
Attendance percentage.
Progress.
Teacher/instructor notes later.
Reports over the student's entire course.
Teacher analytics — later
Each teacher can eventually see their assigned students.
Students organized by course/batch.
Teacher records attendance.
Teacher records progress.
Teacher adds notes/reports.
Admin can see performance/attendance across teachers and students.
Storage
Continue using enrollments.json and teachers.json temporarily while developing.
We do not Git commit every new student.
Before production, move student/authentication/payment/attendance data to a real database.
Design the JSON structures now so migration to the database doesn't require redesigning the whole application.