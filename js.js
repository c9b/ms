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
    document.getElementById('team1Label').textContent = team1Name;
    document.getElementById('team2Label').textContent = team2Name;
    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;

    updateProgressBars();

    // عرض النتائج المخزنة مسبقًا
    rounds.forEach(round => {
        const newRow = `
            <tr>
                <td>${round.points1}</td>
                <td>${round.points2}</td>
                <td><button class="btn btn-danger" onclick="deleteRow(this, ${round.points1}, ${round.points2})">حذف</button></td>
            </tr>
        `;
        document.getElementById('resultsTable').innerHTML += newRow;
    });

    // إخفاء النتائج وعرض نموذج الأسماء فقط
    document.getElementById('resultsSection').style.display = 'none';
});

document.getElementById('teamNamesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    team1Name = document.getElementById('team1Name').value;
    team2Name = document.getElementById('team2Name').value;

    // تعيين الأسماء في العناصر المناسبة
    document.getElementById('team1Header').textContent = team1Name;
    document.getElementById('team2Header').textContent = team2Name;
    document.getElementById('team1Label').textContent = team1Name;
    document.getElementById('team2Label').textContent = team2Name;
    document.getElementById('team1LabelAbove').textContent = team1Name;
    document.getElementById('team2LabelAbove').textContent = team2Name;

    // حفظ الأسماء في localStorage
    localStorage.setItem('team1Name', team1Name);
    localStorage.setItem('team2Name', team2Name);

    // إخفاء نموذج الأسماء وعرض النتائج
    document.getElementById('teamNamesForm').style.display = 'none';
    showResultsSection();
});

document.getElementById('resultsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const points1 = parseInt(document.getElementById('points1').value);
    const points2 = parseInt(document.getElementById('points2').value);

    // التحقق من أن النقاط غير سالبة
    if (!validatePoints(points1, points2)) {
        return;
    }

    const newRow = `
        <tr>
            <td>${points1}</td>
            <td>${points2}</td>
            <td><button class="btn btn-danger" onclick="deleteRow(this, ${points1}, ${points2})">حذف</button></td>
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

function validatePoints(points1, points2) {
    return !(points1 < 0 || points2 < 0);
}

function updateProgressBars() {
    const progress1 = (totalPoints1 / 152) * 100;
    const progress2 = (totalPoints2 / 152) * 100;

    document.getElementById('progress1').style.width = `${progress1}%`;
    document.getElementById('progress1').setAttribute('aria-valuenow', progress1);
    document.getElementById('progress2').style.width = `${progress2}%`;
    document.getElementById('progress2').setAttribute('aria-valuenow', progress2);
}

function checkWinner() {
    if (totalPoints1 >= 152 || totalPoints2 >= 152) {
        if (totalPoints1 > totalPoints2) {
            winnerName = team1Name;
            showWinnerMessage(winnerName);
        } else if (totalPoints2 > totalPoints1) {
            winnerName = team2Name;
            showWinnerMessage(winnerName);
        } else {
            winnerName = null;
            console.log("تعادل، تستمر الجولة.");
        }
    }
}

function showWinnerMessage(winner) {
    Swal.fire({
        icon: 'success',
        title: `${winner} فاز!`,
        text: 'تهانينا!',
    }).then(() => {
        // إعادة تعيين القيم
        resetGame();
    });
}

function resetGame() {
    totalPoints1 = 0;
    totalPoints2 = 0;
    rounds = [];
    localStorage.removeItem('totalPoints1');
    localStorage.removeItem('totalPoints2');
    localStorage.removeItem('rounds');
    document.getElementById('resultsTable').innerHTML = '';
    updateProgressBars();
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('teamNamesForm').style.display = 'block'; // إعادة إظهار حقول إدخال أسماء الفرق
}

function deleteRow(button, points1, points2) {
    button.closest('tr').remove(); // حذف الصف
    totalPoints1 -= points1;
    totalPoints2 -= points2;
    localStorage.setItem('totalPoints1', totalPoints1);
    localStorage.setItem('totalPoints2', totalPoints2);
    document.getElementById('total1').textContent = totalPoints1;
    document.getElementById('total2').textContent = totalPoints2;
    updateProgressBars();
}

function showResultsSection() {
    document.getElementById('resultsSection').style.display = 'block'; // إظهار قسم النتائج
}

// يمكنك إخفاء القسم هنا أو في أماكن أخرى حسب الحاجة