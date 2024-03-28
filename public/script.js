// // script.js
//
// // Function to fetch members from the server
// async function fetchMembers() {
//     const response = await fetch('/members');
//     const data = await response.json();
//     return data;
// }
//
// // Function to display member list
// async function displayMemberList() {
//     const members = await fetchMembers();
//     const memberListDiv = document.getElementById('memberList');
//
//     // Clear previous content
//     memberListDiv.innerHTML = '';
//
//     // Display members
//     members.forEach(member => {
//         const memberDiv = document.createElement('div');
//         memberDiv.textContent = member.name; // Display member's name, you can customize this
//         memberDiv.addEventListener('click', () => displayMemberDetails(member._id));
//         memberListDiv.appendChild(memberDiv);
//     });
// }
//
// // Function to fetch member details and display them
// async function displayMemberDetails(memberId) {
//     const response = await fetch(`/members/${memberId}`);
//     const data = await response.json();
//
//     const memberDetailsDiv = document.getElementById('memberDetails');
//     memberDetailsDiv.innerHTML = '';
//
//     // Display member details
//     const memberDetails = document.createElement('div');
//     memberDetails.textContent = JSON.stringify(data); // Display member details, you can customize this
//     memberDetailsDiv.appendChild(memberDetails);
// }
//
// // Initial display of member list
// displayMemberList();
//
// document.addEventListener("DOMContentLoaded", function() {
//     var addButton = document.getElementById("add");
//     var vaccineTable = document.getElementById("vaccine");
//     addButton.disabled = getMaxDose() >= 4;
//
//     function getMaxDose() {
//         var maxDose = 0;
//         var rows = vaccineTable.getElementsByTagName("tr");
//         for (var i = 1; i < rows.length; i++) { // Start from 1 to skip header row
//             var cells = rows[i].getElementsByTagName("td");
//             var dose = parseInt(cells[0].textContent);
//             if (!isNaN(dose) && dose > maxDose) {
//                 maxDose = dose;
//             }
//         }
//         return maxDose;
//     }
// });