import React from 'react'
import '../../App.css'

const PrintInvoice = ({onClose, invoice}) => {
    const handlePrint = () =>{
        window.print();
    }
  return (
    <div className='print-modal'>
      <div id='print-content'> 
        <div className='print-header'>
        <h1>AutoHub</h1>
      </div>
      <div className='print-list'>
      <ul>
        <ol>autohub@gmail.com</ol>
        <ol>0788888888</ol>
        <ol>Kigali-Rwanda</ol>
      </ul>
      </div>
    {/*  {invoice &&(
        <p>{invoiceNumber}</p>
        <p>{createdAt}</p>

    )}*/}

      <div className='buttons'>
      <button onClick={handlePrint}>Print</button>
      <button className='delete' onClick={onClose}>Close</button>
      </div>
    </div>
   </div> 
  )
}

export default PrintInvoice
