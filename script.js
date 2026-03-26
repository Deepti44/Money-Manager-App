var incomeSubcategories = ['Salary', 'Allowances', 'Bonus', 'Petty Cash', 'Other'];
var expenseSubcategories = ['Rent', 'Food', 'Shopping', 'Entertainment', 'Transport', 'Other'];

class Transaction {
  constructor(id, amount, date, category, subcategory, description) {
    this.id = id;
    this.amount = parseFloat(amount);
    this.date = date;
    this.category = category;
    this.subcategory = subcategory;
    this.description = description;
  }
}



class App {

  constructor() {
  
    this.transactions = this.loadFromStorage();
    this.editingId = null;
    this.pieChart = null;
    this.barChart = null;
  }


  loadFromStorage() {
    var saved = localStorage.getItem('transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }

  saveToStorage() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  openForm() {
    this.editingId = null;
    document.getElementById('formTitle').textContent = 'Add Transaction';
    this.clearForm();
    this.setTodayDate();
    document.getElementById('formPopup').classList.add('active');
    document.getElementById('overlay').classList.add('active');
  }

  closeForm() {
    document.getElementById('formPopup').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    this.clearForm();
  }

  setTodayDate() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
  }

  clearForm() {
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
    document.getElementById('description').value = '';
    document.getElementById('subcategory').innerHTML = '<option value="">-- Select --</option>';
    var radios = document.querySelectorAll('input[name="category"]');
    radios.forEach(function(r) { r.checked = false; });
    document.getElementById('amountErr').textContent = '';
    document.getElementById('dateErr').textContent = '';
    document.getElementById('categoryErr').textContent = '';
    document.getElementById('subcategoryErr').textContent = '';
    var fields = ['amount', 'date', 'subcategory'];
    fields.forEach(function(id) {
      document.getElementById(id).classList.remove('invalid');
    });
  }


  updateSubcategories() {
    var selected = document.querySelector('input[name="category"]:checked');
    var dropdown = document.getElementById('subcategory');
    dropdown.innerHTML = '<option value="">-- Select --</option>';

    if (!selected) return;

    var list = selected.value === 'Income' ? incomeSubcategories : expenseSubcategories;

    list.forEach(function(item) {
      var option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      dropdown.appendChild(option);
    });
  }


  validateForm() {
    var isValid = true;

    var amount = document.getElementById('amount').value;
    if (amount === '' || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      document.getElementById('amountErr').textContent = 'Please enter a valid amount greater than 0.';
      document.getElementById('amount').classList.add('invalid');
      isValid = false;
    } else {
      document.getElementById('amountErr').textContent = '';
      document.getElementById('amount').classList.remove('invalid');
    }

    var date = document.getElementById('date').value;
    var today = new Date().toISOString().split('T')[0];
    if (date === '') {
      document.getElementById('dateErr').textContent = 'Please select a date.';
      document.getElementById('date').classList.add('invalid');
      isValid = false;
    } else if (date > today) {
      document.getElementById('dateErr').textContent = 'Date cannot be in the future.';
      document.getElementById('date').classList.add('invalid');
      isValid = false;
    } else {
      document.getElementById('dateErr').textContent = '';
      document.getElementById('date').classList.remove('invalid');
    }


    var category = document.querySelector('input[name="category"]:checked');
    if (!category) {
      document.getElementById('categoryErr').textContent = 'Please select a category.';
      isValid = false;
    } else {
      document.getElementById('categoryErr').textContent = '';
    }


    var sub = document.getElementById('subcategory').value;
    if (sub === '') {
      document.getElementById('subcategoryErr').textContent = 'Please select a sub-category.';
      document.getElementById('subcategory').classList.add('invalid');
      isValid = false;
    } else {
      document.getElementById('subcategoryErr').textContent = '';
      document.getElementById('subcategory').classList.remove('invalid');
    }

    return isValid;
  }



  saveTransaction() {
    try {
      if (!this.validateForm()) return;

      var amount = document.getElementById('amount').value;
      var date = document.getElementById('date').value;
      var category = document.querySelector('input[name="category"]:checked').value;
      var subcategory = document.getElementById('subcategory').value;
      var description = document.getElementById('description').value.trim();

      if (this.editingId === null) {
        var newId = Date.now(); 
        var t = new Transaction(newId, amount, date, category, subcategory, description);
        this.transactions.push(t);
      } else {
        for (var i = 0; i < this.transactions.length; i++) {
          if (this.transactions[i].id === this.editingId) {
            this.transactions[i].amount = parseFloat(amount);
            this.transactions[i].date = date;
            this.transactions[i].category = category;
            this.transactions[i].subcategory = subcategory;
            this.transactions[i].description = description;
            break;
          }
        }
      }

      this.saveToStorage();
      this.closeForm();
      this.renderAll();

    } catch (error) {
      console.error('Something went wrong:', error);
      alert('An error occurred. Please try again.');
    }
  }


  editTransaction(id) {
    var t = null;
    for (var i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].id === id) {
        t = this.transactions[i];
        break;
      }
    }
    if (!t) return;

    this.editingId = id;
    document.getElementById('formTitle').textContent = 'Edit Transaction';
    document.getElementById('amount').value = t.amount;
    document.getElementById('date').value = t.date;
    document.getElementById('description').value = t.description;

    var radios = document.querySelectorAll('input[name="category"]');
    radios.forEach(function(r) {
      if (r.value === t.category) {
        r.checked = true;
      }
    });

    this.updateSubcategories();
    document.getElementById('subcategory').value = t.subcategory;

    document.getElementById('formPopup').classList.add('active');
    document.getElementById('overlay').classList.add('active');
  }


  deleteTransaction(id) {
    var confirmed = confirm('Are you sure you want to delete this transaction?');
    if (!confirmed) return;

    this.transactions = this.transactions.filter(function(t) {
      return t.id !== id;
    });

    this.saveToStorage();
    this.renderAll();
  }

  applyFilter() {
    var catFilter = document.getElementById('filterCategory').value;
    var subFilter = document.getElementById('filterSubcategory').value;
    var fromDate  = document.getElementById('filterFrom').value;
    var toDate    = document.getElementById('filterTo').value;
    var sortBy    = document.getElementById('sortBy').value;

    var subDropdown = document.getElementById('filterSubcategory');
    var previousSub = subDropdown.value;
    subDropdown.innerHTML = '<option value="all">All Sub-categories</option>';

    var subList = [];
    if (catFilter === 'Income') subList = incomeSubcategories;
    else if (catFilter === 'Expense') subList = expenseSubcategories;
    else subList = incomeSubcategories.concat(expenseSubcategories);

    subList.forEach(function(s) {
      var opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      subDropdown.appendChild(opt);
    });
    subDropdown.value = previousSub;

    var filtered = this.transactions.filter(function(t) {
      if (catFilter !== 'all' && t.category !== catFilter) return false;
      if (subFilter !== 'all' && t.subcategory !== subFilter) return false;
      if (fromDate && t.date < fromDate) return false;
      if (toDate && t.date > toDate) return false;
      return true;
    });

    if (sortBy === 'dateDesc') {
      filtered.sort(function(a, b) { return b.date.localeCompare(a.date); });
    } else if (sortBy === 'dateAsc') {
      filtered.sort(function(a, b) { return a.date.localeCompare(b.date); });
    } else if (sortBy === 'amtDesc') {
      filtered.sort(function(a, b) { return b.amount - a.amount; });
    } else if (sortBy === 'amtAsc') {
      filtered.sort(function(a, b) { return a.amount - b.amount; });
    }

    this.renderTable(filtered);
  }

  clearFilter() {
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterSubcategory').innerHTML = '<option value="all">All Sub-categories</option>';
    document.getElementById('filterFrom').value = '';
    document.getElementById('filterTo').value = '';
    document.getElementById('sortBy').value = 'dateDesc';
    this.renderTable(this.transactions);
  }


  renderAll() {
    this.applyFilter();
    this.renderSummary();
    this.renderCharts();
  }

  renderSummary() {
    var totalIncome = 0;
    var totalExpense = 0;

    this.transactions.forEach(function(t) {
      if (t.category === 'Income') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });

    var netBalance = totalIncome - totalExpense;

    document.getElementById('totalIncome').textContent = '₹' + totalIncome.toFixed(2);
    document.getElementById('totalExpense').textContent = '₹' + totalExpense.toFixed(2);
    document.getElementById('netBalance').textContent = '₹' + netBalance.toFixed(2);

    var balanceEl = document.getElementById('netBalance');
    if (netBalance < 0) {
      balanceEl.style.color = '#ef4444';
    } else {
      balanceEl.style.color = '#1e293b';
    }
  }

  renderTable(list) {
    var tbody = document.getElementById('transactionBody');
    tbody.innerHTML = '';

    var emptyMsg = document.getElementById('emptyMsg');

    if (list.length === 0) {
      emptyMsg.style.display = 'block';
      return;
    }
    emptyMsg.style.display = 'none';

    var self = this;

    list.forEach(function(t) {
      var row = document.createElement('tr');

      var badgeClass = t.category === 'Income' ? 'income' : 'expense';
      var amtClass = t.category === 'Income' ? 'income-amt' : 'expense-amt';
      var sign = t.category === 'Income' ? '+' : '-';

      row.innerHTML =
        '<td>' + t.date + '</td>' +
        '<td><span class="badge ' + badgeClass + '">' + t.category + '</span></td>' +
        '<td>' + t.subcategory + '</td>' +
        '<td>' + (t.description || '-') + '</td>' +
        '<td class="' + amtClass + '">' + sign + '₹' + t.amount.toFixed(2) + '</td>' +
        '<td>' +
          '<button class="edit-btn" onclick="app.editTransaction(' + t.id + ')">Edit</button>' +
          '<button class="delete-btn" onclick="app.deleteTransaction(' + t.id + ')">Delete</button>' +
        '</td>';

      tbody.appendChild(row);
    });
  }


  renderCharts() {
    this.renderPieChart();
    this.renderBarChart();
  }

  renderPieChart() {
    var expenseMap = {};
    this.transactions.forEach(function(t) {
      if (t.category === 'Expense') {
        if (!expenseMap[t.subcategory]) {
          expenseMap[t.subcategory] = 0;
        }
        expenseMap[t.subcategory] += t.amount;
      }
    });

    var labels = Object.keys(expenseMap);
    var data = Object.values(expenseMap);

    var colors = ['#f87171','#fb923c','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6'];

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    var ctx = document.getElementById('pieChart').getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  renderBarChart() {
    var totalIncome = 0;
    var totalExpense = 0;

    this.transactions.forEach(function(t) {
      if (t.category === 'Income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    if (this.barChart) {
      this.barChart.destroy();
    }

    var ctx = document.getElementById('barChart').getContext('2d');
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          label: 'Amount (₹)',
          data: [totalIncome, totalExpense],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  downloadCSV() {
    if (this.transactions.length === 0) {
      alert('No transactions to download.');
      return;
    }

    var rows = [['Date', 'Category', 'Sub-Category', 'Description', 'Amount']];

    this.transactions.forEach(function(t) {
      rows.push([t.date, t.category, t.subcategory, t.description || '', t.amount]);
    });

    var csvContent = '';
    rows.forEach(function(row) {
      csvContent += row.join(',') + '\n';
    });

    var blob = new Blob([csvContent], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

}

var app = new App();
app.renderAll();