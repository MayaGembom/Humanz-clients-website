import React, { useState,useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import MaterialTable from "material-table";
import Notification from "./controls/Notification";
import ConfirmDialog from "./ConfirmDialog";
import AddClientDialog from "./AddClientDialog";
import tableIcons from "./controls/MaterialTableIcons";
import axios from 'axios';

function App() {

  useEffect(() => {
    axios.get(`https://limitless-plains-71101.herokuapp.com/getAll`)
    .then(res => {
      const clients = res.data.data;
      console.log(clients);
      setTableData(clients);
    }).catch(error=>{
      console.log("Cannot load clients data")
    })
  }, [])

    const [addClientDialog, setAddClientDialog] = useState({isOpen:false,title:'',subtitle:''})
    const [confirmDialog, setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''})
    const [notify, setNotify] = useState({isOpen:false,message:'',type:''})
    const [tableData, setTableData] = useState([])
    
    function onAddClient(newClient){
      const newList = [...tableData];
      var data = {name:newClient.fullName,id:newClient.id ,ip:newClient.ip	,phone:newClient.phoneNum}
      newList.unshift(data);

      var config = {
        method: 'post',
        url: 'https://limitless-plains-71101.herokuapp.com/',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setTableData(newList );

        setNotify({
          isOpen:true,
          message:  `Add ${newClient.fullName} as new client successfully`,
          type: 'success'
        })
      })
      .catch(function (error) {
        console.log(error);
        setNotify({
          isOpen:true,
          message:  `Could not add ${newClient.fullName}`,
          type: 'error'
        })
      });

      
    }

    const columns = [
        {title:"Full Name", field:"name", filterPlaceholder:"Filter By Name"},
        {title:"Id", field:"id",filterPlaceholder:"Filter By Id"},
        {title:"Phone Number", field:"phone",filterPlaceholder:"Filter By Phone Number"},
        {title:"IP Address", field:"ip",filterPlaceholder:"Filter By IP Address"},
    ]

    return (
      <div>
        <Header />
        <div style={{ padding: '5% 5% 1% 5%' }}>
        <MaterialTable title="Clients Information" 
        actions={[
        {
          icon: tableIcons.Delete,
          tooltip: "Delete User",
          onClick: (event, rowData) => {
                setConfirmDialog({
                    isOpen:true,
                    title: 'Delete Client',
                    subtitle: `Are you sure you want to delete ${rowData.name}?`,
                    onConfirm: ()=>{
                        setConfirmDialog({
                            ...confirmDialog,
                            isOpen : false
                        })

                        var axios = require('axios');
                        var data = JSON.stringify({
                          "id": rowData.id
                        });

                        var config = {
                          method: 'delete',
                          url: 'https://limitless-plains-71101.herokuapp.com/',
                          headers: { 
                            'Content-Type': 'application/json'
                          },
                          data : data
                        };

                        axios(config)
                        .then(function (response) {
                          console.log(JSON.stringify(response.data));

                          setTableData( tableData.filter((item)=> item.id !== rowData.id))
                          console.log("delete " + rowData.id)
                          setNotify({
                              isOpen:true,
                              message:  `Client ${rowData.name} Deleted Successfully`,
                              type: 'success'
                          })

                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                        

                        
                    }
                })
                
            },
        },
        {
          icon: tableIcons.Add,
          tooltip: "Add User",
          isFreeAction: true,
          onClick: (event) => {

            setAddClientDialog({
              isOpen:true,
              onSubmit: (dialogData)=>{
                this.setState({message: dialogData})
                
              }
            })
          },
        },
      ]}
         options={{filtering:true}} columns={columns} data = {tableData} icons={tableIcons} />

</div>

        <Footer />

        <Notification notify={notify} setNotify={setNotify}/>
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}/>
        <AddClientDialog addClientDialog={addClientDialog} setAddClientDialog={setAddClientDialog} getData={onAddClient}/>
      </div>
    );
  }

export default App;