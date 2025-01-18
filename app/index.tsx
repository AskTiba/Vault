import { Stack, Link } from 'expo-router';
import '../global.css';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Category, Transaction, TransactionsByMonth } from '~/types';
import { useSQLiteContext } from 'expo-sqlite';
import TransactionList from '~/components/TransactionList';
import { ScrollView, Text, StyleSheet, TextStyle } from 'react-native';
import Card from '~/components/UI/Card';
import AddTransaction from '~/components/AddTransaction';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsByMonth, setTransactionsByMonth] = useState<TransactionsByMonth>({
    totalExpenses: 0,
    totalIncome: 0,
  });
  const db = useSQLiteContext();

  // On component mount (initial app launch), fetch the data
  useEffect(() => {
    db.withTransactionAsync(async () => {
      await fetchData(); // Ensure this function is run when app starts
    });
  }, [db]);

  /**
   * Fetches transactions, categories, and calculates the current month's transaction summary
   */
  async function fetchData() {
    // Fetch all transactions ordered by date (most recent first)
    const allTransactions = await db.getAllAsync<Transaction>(
      'SELECT * FROM Transactions ORDER BY date DESC;'
    );
    setTransactions(allTransactions);
    console.log('All Transactions:', allTransactions); // Log all transactions to verify data

    // Fetch all categories
    const allCategories = await db.getAllAsync<Category>('SELECT * FROM Categories;');
    setCategories(allCategories);

    // Get the current date and calculate the start and end of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of current month

    // Log start and end of the month
    console.log('Start of Month:', startOfMonth);
    console.log('End of Month:', endOfMonth);

    // Convert to Unix timestamps (seconds)
    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    console.log('Start Timestamp:', startOfMonthTimestamp);
    console.log('End Timestamp:', endOfMonthTimestamp);

    // Fetch transactions for the current month by filtering the date range
    const monthlyTransactions = await db.getAllAsync<TransactionsByMonth>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
        COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
      FROM Transactions
      WHERE date >= ? AND date <= ?;
    `,
      [startOfMonthTimestamp, endOfMonthTimestamp]
    );

    // Log the monthly transactions result to verify the data
    console.log('Monthly Transactions Summary:', monthlyTransactions);

    // Update the state with the fetched monthly summary
    setTransactionsByMonth(monthlyTransactions[0]);
  }

  /**
   * Deletes a transaction by ID and refreshes the data
   * @param {number} id - The ID of the transaction to delete
   */
  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
      await fetchData(); // Refresh data after deletion
    });
  }

  /**
   * Inserts a new transaction into the database and refreshes the data
   * @param {Transaction} transaction - The new transaction to insert
   */
  async function insertTransaction(transaction: Transaction) {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO Transactions (category_id, amount, date, description, type)
        VALUES (?, ?, ?, ?, ?);
      `,
        [
          transaction.category_id,
          transaction.amount,
          transaction.date,
          transaction.description,
          transaction.type,
        ]
      );
      await fetchData(); // Refresh data after insertion
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Vault',
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'RubikMaps',
            fontSize: 36,
            color: '#187ebf',
          },
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 20 }}>
        <AddTransaction insertTransaction={insertTransaction} />
        <TransactionSummary
          totalExpenses={transactionsByMonth.totalExpenses}
          totalIncome={transactionsByMonth.totalIncome}
        />
        <TransactionList
          categories={categories}
          transactions={transactions}
          deleteTransaction={deleteTransaction}
        />
      </ScrollView>
      <StatusBar style="auto" />
    </>
  );
}

/**
 * Component to display the transaction summary for the current month.
 * @param {number} totalIncome - The total income for the current month
 * @param {number} totalExpenses - The total expenses for the current month
 */
function TransactionSummary({ totalIncome, totalExpenses }: TransactionsByMonth) {
  const netIncome = totalIncome - totalExpenses;

  const readablePeriod = new Date().toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });

  const formatMoney = (value: number) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? '-' : ''}$${absValue}`;
  };

  const getMoneyTextStyle = (value: number): TextStyle => ({
    fontWeight: 'bold',
    color: value < 0 ? '#ff4500' : '#2e8b57',
  });

  return (
    <Card style={styles.container}>
      <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
      <Text style={styles.summaryText}>
        Income: <Text style={getMoneyTextStyle(totalIncome)}>{formatMoney(totalIncome)}</Text>
      </Text>
      <Text style={styles.summaryText}>
        Total Expenses:{' '}
        <Text style={getMoneyTextStyle(totalExpenses)}>{formatMoney(totalExpenses)}</Text>
      </Text>
      <Text style={styles.summaryText}>
        Net Income: <Text style={getMoneyTextStyle(netIncome)}>{formatMoney(netIncome)}</Text>
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingBottom: 7,
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
});
