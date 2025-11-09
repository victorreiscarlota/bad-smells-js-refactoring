export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    let report = '';
    let total = 0;

    report += this.generateHeader(reportType, user);

    const visibleItems = this.filterItemsByRole(user, items);

    for (const item of visibleItems) {
      if (user.role === 'ADMIN' && item.value > 1000) {
        item.priority = true;
      }

      report += this.formatItem(reportType, item, user);
      total += item.value;
    }

    report += this.generateFooter(reportType, total);
    return report.trim();
  }

  generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    if (reportType === 'HTML') {
      return (
        `<html><body>\n` +
        `<h1>Relatório</h1>\n` +
        `<h2>Usuário: ${user.name}</h2>\n` +
        `<table>\n` +
        `<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`
      );
    }

    return '';
  }

  filterItemsByRole(user, items) {
    if (user.role === 'ADMIN') {
      return items;
    }

    if (user.role === 'USER') {
      return items.filter((item) => item.value <= 500);
    }

    return [];
  }

  // --- Formatação do corpo ---
  formatItem(reportType, item, user) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }

    if (reportType === 'HTML') {
      const styleAttr = item.priority ? ' style="font-weight:bold;"' : '';
      return `<tr${styleAttr}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }

    return '';
  }


  generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }

    if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }

    return '';
  }
}
