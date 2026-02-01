/**
 * ระบบเช็คชื่อเข้าร่วมกิจกรรม
 * โรงเรียนบ้านเสยเสย
 * Google Apps Script Backend
 */

// ตั้งค่า Spreadsheet ID (เปลี่ยนเป็น ID ของ Google Sheet ของคุณ)
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ชื่อ Sheet
const SHEET_PERSONNEL = 'บุคลากร';
const SHEET_ACTIVITIES = 'กิจกรรม';
const SHEET_ASSIGNMENTS = 'มอบหมาย';
const SHEET_ATTENDANCE = 'เช็คชื่อ';

/**
 * แสดงหน้าเว็บ
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ระบบเช็คชื่อเข้าร่วมกิจกรรม - โรงเรียนบ้านเสยเสย')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * สร้าง Sheet หากยังไม่มี
 */
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // สร้าง Sheet บุคลากร
  if (!ss.getSheetByName(SHEET_PERSONNEL)) {
    const sheet = ss.insertSheet(SHEET_PERSONNEL);
    sheet.appendRow(['id', 'ชื่อ-นามสกุล', 'วันที่สร้าง']);
  }

  // สร้าง Sheet กิจกรรม
  if (!ss.getSheetByName(SHEET_ACTIVITIES)) {
    const sheet = ss.insertSheet(SHEET_ACTIVITIES);
    sheet.appendRow(['id', 'ชื่อกิจกรรม', 'วันที่สร้าง']);
  }

  // สร้าง Sheet มอบหมาย
  if (!ss.getSheetByName(SHEET_ASSIGNMENTS)) {
    const sheet = ss.insertSheet(SHEET_ASSIGNMENTS);
    sheet.appendRow(['id', 'activityId', 'personnelId', 'วันที่มอบหมาย']);
  }

  // สร้าง Sheet เช็คชื่อ
  if (!ss.getSheetByName(SHEET_ATTENDANCE)) {
    const sheet = ss.insertSheet(SHEET_ATTENDANCE);
    sheet.appendRow(['id', 'activityId', 'personnelId', 'สถานะ', 'วันที่บันทึก']);
  }

  return { success: true, message: 'สร้าง Sheet สำเร็จ' };
}

/**
 * สร้าง ID ใหม่
 */
function generateId() {
  return Utilities.getUuid();
}

// ==================== บุคลากร ====================

/**
 * ดึงข้อมูลบุคลากรทั้งหมด
 */
function getPersonnel() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_PERSONNEL);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_PERSONNEL);
  }

  const data = sheet.getDataRange().getValues();
  const personnel = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      personnel.push({
        id: data[i][0],
        name: data[i][1],
        createdAt: data[i][2]
      });
    }
  }

  return personnel;
}

/**
 * เพิ่มบุคลากร
 */
function addPersonnel(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_PERSONNEL);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_PERSONNEL);
  }

  const id = generateId();
  const createdAt = new Date();

  sheet.appendRow([id, name, createdAt]);

  return { success: true, message: 'เพิ่มบุคลากรสำเร็จ', id: id };
}

/**
 * แก้ไขบุคลากร
 */
function updatePersonnel(id, name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_PERSONNEL);

  if (!sheet) {
    return { success: false, message: 'ไม่พบ Sheet บุคลากร' };
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 2).setValue(name);
      return { success: true, message: 'แก้ไขบุคลากรสำเร็จ' };
    }
  }

  return { success: false, message: 'ไม่พบบุคลากร' };
}

/**
 * ลบบุคลากร
 */
function deletePersonnel(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_PERSONNEL);

  if (!sheet) {
    return { success: false, message: 'ไม่พบ Sheet บุคลากร' };
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);

      // ลบข้อมูลที่เกี่ยวข้องในมอบหมายและเช็คชื่อ
      deleteAssignmentsByPersonnel(id);
      deleteAttendanceByPersonnel(id);

      return { success: true, message: 'ลบบุคลากรสำเร็จ' };
    }
  }

  return { success: false, message: 'ไม่พบบุคลากร' };
}

// ==================== กิจกรรม ====================

/**
 * ดึงข้อมูลกิจกรรมทั้งหมด
 */
function getActivities() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_ACTIVITIES);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_ACTIVITIES);
  }

  const data = sheet.getDataRange().getValues();
  const activities = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      activities.push({
        id: data[i][0],
        name: data[i][1],
        createdAt: data[i][2]
      });
    }
  }

  return activities;
}

/**
 * เพิ่มกิจกรรม
 */
function addActivity(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_ACTIVITIES);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_ACTIVITIES);
  }

  const id = generateId();
  const createdAt = new Date();

  sheet.appendRow([id, name, createdAt]);

  return { success: true, message: 'เพิ่มกิจกรรมสำเร็จ', id: id };
}

/**
 * แก้ไขกิจกรรม
 */
function updateActivity(id, name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ACTIVITIES);

  if (!sheet) {
    return { success: false, message: 'ไม่พบ Sheet กิจกรรม' };
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 2).setValue(name);
      return { success: true, message: 'แก้ไขกิจกรรมสำเร็จ' };
    }
  }

  return { success: false, message: 'ไม่พบกิจกรรม' };
}

/**
 * ลบกิจกรรม
 */
function deleteActivity(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ACTIVITIES);

  if (!sheet) {
    return { success: false, message: 'ไม่พบ Sheet กิจกรรม' };
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);

      // ลบข้อมูลที่เกี่ยวข้อง
      deleteAssignmentsByActivity(id);
      deleteAttendanceByActivity(id);

      return { success: true, message: 'ลบกิจกรรมสำเร็จ' };
    }
  }

  return { success: false, message: 'ไม่พบกิจกรรม' };
}

// ==================== มอบหมาย ====================

/**
 * ดึงข้อมูลการมอบหมายตามกิจกรรม
 */
function getAssignmentsByActivity(activityId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_ASSIGNMENTS);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_ASSIGNMENTS);
  }

  const data = sheet.getDataRange().getValues();
  const personnel = getPersonnel();
  const personnelMap = {};

  personnel.forEach(p => {
    personnelMap[p.id] = p.name;
  });

  const assignments = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === activityId) {
      assignments.push({
        id: data[i][0],
        activityId: data[i][1],
        personnelId: data[i][2],
        personnelName: personnelMap[data[i][2]] || 'ไม่พบข้อมูล',
        assignedAt: data[i][3]
      });
    }
  }

  return assignments;
}

/**
 * เพิ่มการมอบหมาย (หลายคน)
 */
function addAssignments(activityId, personnelIds) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_ASSIGNMENTS);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_ASSIGNMENTS);
  }

  // ตรวจสอบการมอบหมายที่มีอยู่แล้ว
  const existingAssignments = getAssignmentsByActivity(activityId);
  const existingPersonnelIds = existingAssignments.map(a => a.personnelId);

  const newAssignments = personnelIds.filter(id => !existingPersonnelIds.includes(id));

  const assignedAt = new Date();

  newAssignments.forEach(personnelId => {
    const id = generateId();
    sheet.appendRow([id, activityId, personnelId, assignedAt]);
  });

  return {
    success: true,
    message: `เพิ่มการมอบหมายสำเร็จ ${newAssignments.length} คน`,
    added: newAssignments.length,
    skipped: personnelIds.length - newAssignments.length
  };
}

/**
 * ลบการมอบหมาย
 */
function deleteAssignment(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ASSIGNMENTS);

  if (!sheet) {
    return { success: false, message: 'ไม่พบ Sheet มอบหมาย' };
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      // ลบเช็คชื่อที่เกี่ยวข้อง
      deleteAttendanceByAssignment(data[i][1], data[i][2]);
      sheet.deleteRow(i + 1);
      return { success: true, message: 'ลบการมอบหมายสำเร็จ' };
    }
  }

  return { success: false, message: 'ไม่พบการมอบหมาย' };
}

/**
 * ลบการมอบหมายทั้งหมดของบุคลากร
 */
function deleteAssignmentsByPersonnel(personnelId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ASSIGNMENTS);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][2] === personnelId) {
      sheet.deleteRow(i + 1);
    }
  }
}

/**
 * ลบการมอบหมายทั้งหมดของกิจกรรม
 */
function deleteAssignmentsByActivity(activityId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ASSIGNMENTS);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === activityId) {
      sheet.deleteRow(i + 1);
    }
  }
}

// ==================== เช็คชื่อ ====================

/**
 * ดึงข้อมูลการเช็คชื่อตามกิจกรรม
 */
function getAttendanceByActivity(activityId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_ATTENDANCE);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_ATTENDANCE);
  }

  const data = sheet.getDataRange().getValues();
  const attendance = {};

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === activityId) {
      attendance[data[i][2]] = {
        id: data[i][0],
        status: data[i][3],
        recordedAt: data[i][4]
      };
    }
  }

  return attendance;
}

/**
 * บันทึกการเช็คชื่อ
 */
function saveAttendance(activityId, attendanceData) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_ATTENDANCE);

  if (!sheet) {
    initializeSheets();
    sheet = ss.getSheetByName(SHEET_ATTENDANCE);
  }

  const existingAttendance = getAttendanceByActivity(activityId);
  const recordedAt = new Date();

  attendanceData.forEach(item => {
    if (existingAttendance[item.personnelId]) {
      // อัพเดทข้อมูลที่มีอยู่
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] === activityId && data[i][2] === item.personnelId) {
          sheet.getRange(i + 1, 4).setValue(item.status);
          sheet.getRange(i + 1, 5).setValue(recordedAt);
          break;
        }
      }
    } else {
      // เพิ่มข้อมูลใหม่
      const id = generateId();
      sheet.appendRow([id, activityId, item.personnelId, item.status, recordedAt]);
    }
  });

  return { success: true, message: 'บันทึกการเช็คชื่อสำเร็จ' };
}

/**
 * ลบเช็คชื่อตามบุคลากร
 */
function deleteAttendanceByPersonnel(personnelId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ATTENDANCE);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][2] === personnelId) {
      sheet.deleteRow(i + 1);
    }
  }
}

/**
 * ลบเช็คชื่อตามกิจกรรม
 */
function deleteAttendanceByActivity(activityId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ATTENDANCE);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === activityId) {
      sheet.deleteRow(i + 1);
    }
  }
}

/**
 * ลบเช็คชื่อตามการมอบหมาย
 */
function deleteAttendanceByAssignment(activityId, personnelId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_ATTENDANCE);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === activityId && data[i][2] === personnelId) {
      sheet.deleteRow(i + 1);
    }
  }
}

// ==================== Dashboard ====================

/**
 * ดึงข้อมูลสำหรับ Dashboard
 */
function getDashboardData() {
  const personnel = getPersonnel();
  const activities = getActivities();

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const attendanceSheet = ss.getSheetByName(SHEET_ATTENDANCE);
  const assignmentSheet = ss.getSheetByName(SHEET_ASSIGNMENTS);

  // นับกิจกรรมที่บันทึกแล้วและยังไม่บันทึก
  const activitiesWithAttendance = new Set();

  if (attendanceSheet) {
    const attendanceData = attendanceSheet.getDataRange().getValues();
    for (let i = 1; i < attendanceData.length; i++) {
      if (attendanceData[i][1]) {
        activitiesWithAttendance.add(attendanceData[i][1]);
      }
    }
  }

  // ดึงข้อมูลสำหรับตารางและกราฟ
  const activityStats = [];

  activities.forEach(activity => {
    const assignments = getAssignmentsByActivity(activity.id);
    const attendance = getAttendanceByActivity(activity.id);

    let attended = 0;
    let notAttended = 0;

    assignments.forEach(a => {
      if (attendance[a.personnelId]) {
        if (attendance[a.personnelId].status === 'เข้าร่วม') {
          attended++;
        } else {
          notAttended++;
        }
      }
    });

    const isRecorded = activitiesWithAttendance.has(activity.id);

    activityStats.push({
      id: activity.id,
      name: activity.name,
      totalAssigned: assignments.length,
      attended: attended,
      notAttended: notAttended,
      status: isRecorded ? 'บันทึกแล้ว' : 'ยังไม่บันทึก'
    });
  });

  return {
    totalPersonnel: personnel.length,
    totalActivities: activities.length,
    recordedActivities: activitiesWithAttendance.size,
    notRecordedActivities: activities.length - activitiesWithAttendance.size,
    activityStats: activityStats
  };
}

/**
 * ดึงข้อมูลสรุปการเข้าร่วมกิจกรรม
 */
function getActivitySummary(activityId) {
  const assignments = getAssignmentsByActivity(activityId);
  const attendance = getAttendanceByActivity(activityId);

  const summary = [];
  let attended = 0;
  let notAttended = 0;

  assignments.forEach(a => {
    const status = attendance[a.personnelId] ? attendance[a.personnelId].status : 'ยังไม่บันทึก';

    if (status === 'เข้าร่วม') {
      attended++;
    } else if (status === 'ไม่เข้าร่วม') {
      notAttended++;
    }

    summary.push({
      personnelId: a.personnelId,
      personnelName: a.personnelName,
      status: status
    });
  });

  return {
    total: assignments.length,
    attended: attended,
    notAttended: notAttended,
    details: summary
  };
}

/**
 * ดึงข้อมูลสำหรับเช็คชื่อ
 */
function getAttendanceData(activityId) {
  const assignments = getAssignmentsByActivity(activityId);
  const attendance = getAttendanceByActivity(activityId);

  const data = [];
  let attended = 0;
  let notAttended = 0;
  let isRecorded = false;

  assignments.forEach(a => {
    const attendanceInfo = attendance[a.personnelId];
    let status = 'เข้าร่วม'; // ค่าเริ่มต้น

    if (attendanceInfo) {
      status = attendanceInfo.status;
      isRecorded = true;
    }

    if (attendanceInfo) {
      if (attendanceInfo.status === 'เข้าร่วม') {
        attended++;
      } else {
        notAttended++;
      }
    }

    data.push({
      personnelId: a.personnelId,
      personnelName: a.personnelName,
      status: status,
      hasRecord: !!attendanceInfo
    });
  });

  return {
    total: assignments.length,
    attended: attended,
    notAttended: notAttended,
    isRecorded: isRecorded,
    details: data
  };
}

/**
 * ดึงบุคลากรที่ยังไม่ได้มอบหมายในกิจกรรม
 */
function getUnassignedPersonnel(activityId) {
  const personnel = getPersonnel();
  const assignments = getAssignmentsByActivity(activityId);
  const assignedPersonnelIds = assignments.map(a => a.personnelId);

  return personnel.filter(p => !assignedPersonnelIds.includes(p.id));
}
