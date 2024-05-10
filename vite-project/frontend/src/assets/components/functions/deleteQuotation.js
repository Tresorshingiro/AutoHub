const deleteQuotation = async (Quotations, setQuotations, getLoc, user) => {
    if(!user) {
        return
    }
    if(window.confirm(`Are you sure you want to Delete this Quotation of ${Quotations.createdAt}`)){
        try{
            const deleteResponse = await fetch(getLoc + Quotations.id, {
                method:'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await deleteResponse.json();

            if (deleteResponse.status === 200) {
                alert(`Deleted Quotation of ${Quotations.owner.names}`);
                setQuotations(prevQuotation => prevQuotation.filter(q = q._id !== quotation._id));
            } else{
                console.error(json.error);
                alert(`Failed to delete the Quotation due to ${json.error}`);
            }
        } catch (error) {
            console.error('An error occured:', error);
            alert('An error occurred while deleting the vehicle')
        }
    }

};

export default deleteQuotation;