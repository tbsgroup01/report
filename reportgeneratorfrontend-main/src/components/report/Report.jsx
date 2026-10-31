import React, { useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
const emptyFormData2 = {
  "File No": "FN123456",
  "Invoice date": "2022-07-07T05:28:41.351Z",
  "Device Name": "Smartphone",
  MMS: "Enabled",
  "customer type": "Business",
  "company name": "ABC Company",
  city: "New York",
  "residence type": "Apartment",
  "agency type": "Marketing",
  balance: "$1000.00",
  "card expiry date": "2024-12-31T23:59:59.999Z",
  "Record No": "R123456789",
  "phone No": "+1234567890",
  "phone cost": "$200.00",
  texts: "Unlimited",
  "cust name": "John Doe",
  "cust address": "123 Main Street",
  state: "California",
  "agent no": "A987654321",
  "agency name": "XYZ Agency",
  "Credit card type": "Visa",
  "Credit rate": "18%",
  "invoice no": "INV-2023001",
  "price plan": "Gold",
  "monthly cost": "$50.00",
  "extra value included": "Bonus emptyFormData",
  details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  email: "john.doe@example.com",
  zip: "12345",
  "agent name": "Agent Smith",
  deposit: "$500.00",
  "credit card no.": "1234-5678-9012-3456",
  remark: "No special remarks",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  section: {
    margin: 10,
    fontSize: 12,
  },
});

const PDFReport = ({ emptyFormData }) => {
  // console.log();
  useEffect(() => {}, [emptyFormData["File No"]]);
  return (
    <PDFViewer width="100%" height="600px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>File No: {emptyFormData["File No"]}</Text>
            <Text>
              Invoice date:{" "}
              {new Date(emptyFormData["Invoice date"]).toLocaleDateString()}
            </Text>
            <Text>Device Name: {emptyFormData["Device Name"]}</Text>
            <Text>MMS: {emptyFormData["MMS"]}</Text>
            <Text>Customer Type: {emptyFormData["customer type"]}</Text>
            <Text>Company Name: {emptyFormData["company name"]}</Text>
            <Text>City: {emptyFormData["city"]}</Text>
            <Text>Residence Type: {emptyFormData["residence type"]}</Text>
            <Text>Agency Type: {emptyFormData["agency type"]}</Text>
            <Text>Balance: {emptyFormData["balance"]}</Text>
            <Text>
              Card Expiry Date:{" "}
              {new Date(emptyFormData["card expiry date"]).toLocaleDateString()}
            </Text>
            <Text>Record No: {emptyFormData["Record No"]}</Text>
            <Text>Phone No: {emptyFormData["phone No"]}</Text>
            <Text>Phone Cost: {emptyFormData["phone cost"]}</Text>
            <Text>Texts: {emptyFormData["texts"]}</Text>
            <Text>Customer Name: {emptyFormData["cust name"]}</Text>
            <Text>Customer Address: {emptyFormData["cust address"]}</Text>
            <Text>State: {emptyFormData["state"]}</Text>
            <Text>Agent No: {emptyFormData["agent no"]}</Text>
            <Text>Agency Name: {emptyFormData["agency name"]}</Text>
            <Text>Credit Card Type: {emptyFormData["Credit card type"]}</Text>
            <Text>Credit Rate: {emptyFormData["Credit rate"]}</Text>
            <Text>Invoice No: {emptyFormData["invoice no"]}</Text>
            <Text>Price Plan: {emptyFormData["price plan"]}</Text>
            <Text>Monthly Cost: {emptyFormData["monthly cost"]}</Text>
            <Text>
              Extra Value Included: {emptyFormData["extra value included"]}
            </Text>
            <Text>Details: {emptyFormData["details"]}</Text>
            <Text>Email: {emptyFormData["email"]}</Text>
            <Text>ZIP: {emptyFormData["zip"]}</Text>
            <Text>Agent Name: {emptyFormData["agent name"]}</Text>
            <Text>Deposit: {emptyFormData["deposit"]}</Text>
            <Text>Credit Card No.: {emptyFormData["credit card no."]}</Text>
            <Text>Remark: {emptyFormData["remark"]}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFReport;
