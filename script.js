let totalPoints1 = parseInt(localStorage.getItem('totalPoints1')) || 0;
let totalPoints2 = parseInt(localStorage.getItem('totalPoints2')) || 0;
let team1Name = localStorage.getItem('team1Name') || 'الفريق 1';
let team2Name = localStorage.getItem('team2Name') || 'الفريق 2';
let rounds = JSON.parse(localStorage.getItem('rounds')) || [];
let winnerName = localStorage.getItem('winnerName') || null;

document.addEventListener('DOMContentLoaded', function() {
    // تحديث أسماء الفرق المخزنة أو استخدام الافتراضية
    team1Name = localStorage.getItem('team1Name') || 'الفريق 1';
    team2Name = localStorage.getItem('team2Name') || 'الفريق 2';

    // تعيين الأسماء في الحقول المختلفة
    document.getElementById('team1LabelAbove').textContent = team1Name;
    document.getElementById('team2LabelAbove').textContent = team2Name;
    document.getElementById('team1Header').textContent = team1Name;
    document.getElementById('team2Header').textContent = team2Name;
    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;

    updateProgressBars();

    // عرض النتائج المخزنة مسبقًا
    rounds.forEach(round => {
        const newRow = `
            <tr>
                <td><h1><span class="badge bg-info text-dark">${round.points1}</span></h1></td>
                <td><h1><span class="badge bg-info text-dark">${round.points2}</span></h1></td>
            </tr>
        `;
        document.getElementById('resultsTable').innerHTML += newRow;
    });

    // تحقق من أسماء الفرق في localStorage
    if (team1Name !== 'الفريق 1' && team2Name !== 'الفريق 2') {
        // إذا كانت الأسماء موجودة، إخفاء نموذج الأسماء وعرض النتائج
        document.getElementById('teamNamesForm').style.display = 'none';
        showResultsSection();
    } else {
        // إذا كانت الأسماء غير موجودة، تأكد من عرض صندوق الإدخال
        document.getElementById('teamNamesForm').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none'; // تأكد من إخفاء قسم النتائج
    }

    if (winnerName) {
        const modalMessage = document.getElementById("modalMessage");
        modalMessage.textContent = `${winnerName} الفائز!`;
        $('#winnerModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#winnerModal').modal('show');
    }
});


document.getElementById('teamNamesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    team1Name = document.getElementById('team1Name').value;
    team2Name = document.getElementById('team2Name').value;

    document.getElementById('team1Header').textContent = team1Name;
    document.getElementById('team2Header').textContent = team2Name;
    document.getElementById('team1LabelAbove').textContent = team1Name;
    document.getElementById('team2LabelAbove').textContent = team2Name;
    localStorage.setItem('team1Name', team1Name);
    localStorage.setItem('team2Name', team2Name);

    document.getElementById('teamNamesForm').style.display = 'none';
    showResultsSection();
});

document.getElementById('resultsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const points1 = parseInt(document.getElementById('points1').value);
    const points2 = parseInt(document.getElementById('points2').value);

    // التحقق من أن النقاط غير سالبة
    if (points1 < 0 || points2 < 0) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ!',
            text: 'الرجاء إدخال نقاط صحيحة (غير سالبة).',
        });
        return;
    }

    const newRow = `
        <tr>
            <td><h1><span class="badge bg-info text-dark">${points1}</span></h1></td>
            <td><h1><span class="badge bg-info text-dark">${points2}</span></h1></td>
        </tr>
    `;
    document.getElementById('resultsTable').innerHTML += newRow;

    totalPoints1 += points1;
    totalPoints2 += points2;

    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;

    rounds.push({
        points1,
        points2
    });
    localStorage.setItem('rounds', JSON.stringify(rounds));
    localStorage.setItem('totalPoints1', totalPoints1);
    localStorage.setItem('totalPoints2', totalPoints2);

    updateProgressBars();
    checkWinner();
    document.getElementById('points1').value = '';
    document.getElementById('points2').value = '';
});

function updateProgressBars() {
    const progress1 = (totalPoints1 / 152) * 100;
    const progress2 = (totalPoints2 / 152) * 100;

    document.getElementById('progress1').style.width = `${progress1}%`;
    document.getElementById('progress1').setAttribute('aria-valuenow', progress1);

    document.getElementById('progress2').style.width = `${progress2}%`;
    document.getElementById('progress2').setAttribute('aria-valuenow', progress2);
}

function checkWinner() {
    // تحقق إذا كانت النقاط أكبر من 152
    if (totalPoints1 >= 152 || totalPoints2 >= 152) {
        if (totalPoints1 > totalPoints2) {
            winnerName = team1Name; // الفريق الأول هو الفائز
            showWinnerMessage(winnerName);
        } else if (totalPoints2 > totalPoints1) {
            winnerName = team2Name; // الفريق الثاني هو الفائز
            showWinnerMessage(winnerName);
        } else {
            // حالة التعادل، لا نعرض أي فائز
            winnerName = null;
            console.log("تعادل، تستمر الجولة.");
        }
    }
}

// دالة لإظهار رسالة الفائز
function showWinnerMessage(winner) {
    if (winner) {
        localStorage.setItem('winnerName', winner);
        const modalMessage = document.getElementById("modalMessage");
        modalMessage.textContent = `${winner} الفائز`;
        $('#winnerModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#winnerModal').modal('show');
    }
}

document.getElementById('resetBtn').addEventListener('click', confirmReset);
document.getElementById('resetModalBtn').addEventListener('click', confirmReset);

function confirmReset() {
    const confirmAction = confirm("هل أنت متأكد.");
    if (confirmAction) {
        resetGame();
    }
}

function resetGame() {
    localStorage.clear();
    // إعادة تعيين المتغيرات
    totalPoints1 = 0;
    totalPoints2 = 0;
    rounds = [];
    winnerName = null;

    // إعادة تعيين النصوص في العناصر
    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;
    document.getElementById('resultsTable').innerHTML = ''; // تفريغ الجدول
    updateProgressBars();

    // إغلاق النافذة المنبثقة (إذا كانت مفتوحة)
    const winnerModal = $('#winnerModal');
    if (winnerModal.hasClass('show')) {
        winnerModal.modal('hide');
    }

    // إظهار نموذج إدخال أسماء الفرق
    document.getElementById('teamNamesForm').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none'; // إخفاء قسم النتائج
}

// إضافة مستمع للحدث على زر إعادة تعيين في النافذة المنبثقة
document.getElementById('resetModalBtn').addEventListener('click', function() {
    resetGame(); // استدعاء دالة resetGame
    $('#winnerModal').modal('hide'); // إغلاق النافذة المنبثقة
});

function deleteRow(button, points1, points2) {
    totalPoints1 -= points1;
    totalPoints2 -= points2;

    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;

    localStorage.setItem('totalPoints1', totalPoints1);
    localStorage.setItem('totalPoints2', totalPoints2);

    rounds = rounds.filter(round => !(round.points1 === points1 && round.points2 === points2));
    localStorage.setItem('rounds', JSON.stringify(rounds));

    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    updateProgressBars();
}

function showResultsSection() {
    document.getElementById('resultsSection').style.display = 'block';
}


// زر التراجع عن آخر نتيجة
document.getElementById('undoBtn').addEventListener('click', undoLastEntry);

function undoLastEntry() {
    if (rounds.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'لا توجد نتائج!',
            text: 'لا يوجد أي نتيجة للتراجع عنها.',
        });
        return;
    }

    // الحصول على آخر جولة
    const lastRound = rounds.pop();
    totalPoints1 -= lastRound.points1;
    totalPoints2 -= lastRound.points2;

    // تحديث النقاط الإجمالية
    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;

    // إزالة آخر صف من الجدول
    const resultsTable = document.getElementById('resultsTable');
    resultsTable.deleteRow(resultsTable.rows.length - 1);

    // حفظ التحديثات في localStorage
    localStorage.setItem('rounds', JSON.stringify(rounds));
    localStorage.setItem('totalPoints1', totalPoints1);
    localStorage.setItem('totalPoints2', totalPoints2);

    updateProgressBars();
}

// دالة لتحديث شريط التقدم
function updateProgressBars() {
    const progress1 = (totalPoints1 / 152) * 100;
    const progress2 = (totalPoints2 / 152) * 100;

    document.getElementById('progress1').style.width = `${progress1}%`;
    document.getElementById('progress1').setAttribute('aria-valuenow', progress1);

    document.getElementById('progress2').style.width = `${progress2}%`;
    document.getElementById('progress2').setAttribute('aria-valuenow', progress2);
}

// دالة إعادة التعيين
function confirmReset() {
    const confirmAction = confirm("هل أنت متأكد أنك تريد إعادة تعيين السجل؟ لا يمكن التراجع عن هذا الإجراء.");
    if (confirmAction) {
        resetGame();
    }
}

// دالة إعادة تعيين اللعبة
function resetGame() {
    localStorage.clear();
    totalPoints1 = 0;
    totalPoints2 = 0;
    rounds = [];
    winnerName = null;

    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;
    document.getElementById('resultsTable').innerHTML = ''; // تفريغ الجدول
    updateProgressBars();

    const winnerModal = $('#winnerModal');
    if (winnerModal.hasClass('show')) {
        winnerModal.modal('hide');
    }

    document.getElementById('teamNamesForm').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}
