import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../domain/models';
import { Alert } from 'react-native';
import * as XLSX from 'xlsx';

export const exportTransactionsToExcel = async (transactions: Transaction[], month: string, salary: number, totalObligations: number, totalBorrowed: number, remainingSalary: number) => {
  try {
    if (!transactions || transactions.length === 0) {
      Alert.alert('Export Excel', 'No transactions to export');
      return;
    }

    // Create summary data
    const summaryData = [
      ['Monthly Financial Report'],
      ['Month:', month],
      [''],
      ['Summary'],
      ['Monthly Salary:', salary],
      ['Total Obligations:', totalObligations],
      ['Total Borrowed:', totalBorrowed],
      ['Remaining:', remainingSalary],
      [''],
      ['Transactions'],
      ['ID', 'Title', 'Amount', 'Type', 'Category', 'Notes', 'Status', 'Date']
    ];

    // Add transaction rows
    const transactionRows = transactions.map(tx => [
      tx.id,
      tx.title,
      tx.amount,
      tx.type === 'obligation' ? 'Obligation' : 'Borrowed',
      tx.category || '',
      tx.notes || '',
      tx.isPaid ? 'Paid' : 'Unpaid',
      tx.date
    ]);

    const allData = [...summaryData, ...transactionRows];

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // Set column widths
    ws['!cols'] = [
      { wch: 5 },   // ID
      { wch: 25 },  // Title
      { wch: 12 },  // Amount
      { wch: 12 },  // Type
      { wch: 15 },  // Category
      { wch: 20 },  // Notes
      { wch: 10 },  // Status
      { wch: 12 }   // Date
    ];

    // Generate Excel file
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const fileName = `transactions_${month.replace(/\s+/g, '_')}.xlsx`;
    const fileUri = FileSystem.documentDirectory + fileName;

    console.log('Exporting Excel to:', fileUri);

    // Write file
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Excel file written successfully');

    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Transactions',
        UTI: 'com.microsoft.excel.xlsx'
      });
      console.log('Excel file shared successfully');
      Alert.alert('Success', 'Excel file exported successfully!');
    } else {
      Alert.alert('Export Excel', 'Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error exporting Excel:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    Alert.alert('Export Failed', `Failed to export Excel: ${errorMessage}`);
  }
};

export const exportTransactionsToCSV = async (transactions: Transaction[], month: string) => {
  try {
    if (!transactions || transactions.length === 0) {
      Alert.alert('Export CSV', 'No transactions to export');
      return;
    }

    const BOM = '\uFEFF';
    const header = 'ID,Title,Amount,Type,Category,Notes,Status,Date\n';
    const rows = transactions.map(tx => 
      `${tx.id},"${tx.title}",${tx.amount},${tx.type},"${tx.category || ''}","${tx.notes || ''}",${tx.isPaid ? 'Paid' : 'Unpaid'},${tx.date}`
    ).join('\n');

    const csvContent = BOM + header + rows;
    const fileName = `transactions_${month.replace(/\s+/g, '_')}.csv`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Transactions',
      });
      Alert.alert('Success', 'CSV exported successfully!');
    } else {
      Alert.alert('Export CSV', 'Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    Alert.alert('Export Failed', `Failed to export CSV: ${errorMessage}`);
  }
};
