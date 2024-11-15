document.getElementById('diaryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    const entry = document.getElementById('diaryEntry').value;
    const date = new Date().toLocaleDateString('ja-JP'); // 日本のロケールで日付をフォーマット
    const diaryItem = {
        id: Date.now(), // ユニークなIDを生成
        date: date,
        content: entry
    };

    // ローカルストレージから日記を取得し、新しいエントリーを追加
    let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    diaryEntries.push(diaryItem);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));

    // 入力をクリアし、日記を表示
    document.getElementById('diaryEntry').value = '';
    displayDiaryEntries();
});

function displayDiaryEntries(filterDate = null) {
    const diaryList = document.getElementById('diaryList');
    diaryList.innerHTML = ''; // 既存の内容をクリア

    let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    
    // 日付によるフィルタリング
    if (filterDate) {
        diaryEntries = diaryEntries.filter(entry => entry.date === filterDate);
    }

    // 新しい日付が上に来るようにソート
    diaryEntries.sort((a, b) => b.id - a.id);

    diaryEntries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('diary-entry');
        entryDiv.innerHTML = `
            <strong>${entry.date}</strong>
            <p>${entry.content.substring(0, 3)}...</p> <!-- 最初の3文字を表示 -->
            <button onclick="deleteDiaryEntry(${entry.id})">削除</button>
        `;
        entryDiv.addEventListener('click', () => openModal(entry));
        diaryList.appendChild(entryDiv);
    });
}

// モーダル関連の関数
function openModal(entry) {
    document.getElementById('modalDate').textContent = entry.date;
    document.getElementById('modalContent').textContent = entry.content;
    document.getElementById('diaryModal').style.display = 'block';
}

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('diaryModal').style.display = 'none';
});

// 日付フィルターのイベントリスナーを追加
document.getElementById('dateFilter').addEventListener('change', function() {
    const filterDate = new Date(this.value).toLocaleDateString('ja-JP');
    displayDiaryEntries(filterDate);
});

function deleteDiaryEntry(id) {
    let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    diaryEntries = diaryEntries.filter(entry => entry.id !== id);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    displayDiaryEntries();
}

// ページロード時に日記を表示
displayDiaryEntries();
