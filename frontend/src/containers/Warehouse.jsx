import {Box, Modal, ModalClose, Sheet, Stack, Typography} from '@mui/joy'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from 'react'
import {addNewDuck, fetchDuckConstants, fetchDucks, updateDuck} from '../services/ducks.jsx'
import styled from 'styled-components'

const Warehouse = () => {

    const dispatch = useDispatch()
    const ducks = useSelector(state => state.ducks.ducks)
    const constants = useSelector(state => state.ducks.constants)
    const activeDucks = ducks && ducks.filter(d => !d.deleted) || []

    const [modalOpen, setModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [currentDuck, setCurrentDuck] = useState({})

    useEffect(() => {
        if (!ducks) {
            dispatch(fetchDucks())
        }
        if (!constants) {
            dispatch(fetchDuckConstants())
        }
    }, [])

    const openDuckForm = (edit, id) => {
        setIsEdit(edit)
        setModalOpen(true)
        //if editing, put current duck data into form default - otherwise default duck
        //find instead of filter to get the actual object, ids are distinct so should never need to check for multiple
        edit && id ?
            setCurrentDuck(ducks.find(d => d.id === id)) :
            setCurrentDuck({
                color: 'Red',
                size: 'XLarge',
                quantity: 0,
                price: 0,
            })
    }

    const openDeleteForm = (id) => {
        setCurrentDuck(ducks.find(d => d.id === id))
        setIsDelete(true)
        setModalOpen(true)
    }

    const clearAll = () => {
        setModalOpen(false)
        setIsEdit(false)
        setIsDelete(false)
        setCurrentDuck({})
    }

    const addDuck = async () => {
        //see addNewDuck function for potential optimization
        await dispatch(addNewDuck(currentDuck))
        clearAll()
    }

    const editDuck = async () => {
        //see updateDuck function for potential optimization
        await dispatch(updateDuck(currentDuck))
        clearAll()
    }

    const deleteDuck = async () => {
        //currently keeps quantity when deleting, so when you add a new duck with the same color+size+price it adds the pre-existing quantity - is that wanted?
        const delDuck = { ...currentDuck, deleted: true }
        //see updateDuck function for potential optimization
        await dispatch(updateDuck(delDuck))
        clearAll()
    }

    return (
        <div>
            <Stack direction='column' spacing={5} sx={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '55px',
            }}>
                <Typography level='h1'>Duck Warehouse</Typography>
                <Box sx={{ width: '95%' }}>
                    <StyledButton onClick={() => {openDuckForm(false, null)}}>
                        Add Duck
                    </StyledButton>
                    <hr />
                    <StyledTable>
                        <thead>
                            <tr>
                                <StyledTH style={{ width: '10%'}}>ID</StyledTH>
                                <StyledTH style={{ width: '25%'}}>Color</StyledTH>
                                <StyledTH style={{ width: '10%'}}>Size</StyledTH>
                                <StyledTH style={{ width: '10%'}}>Price</StyledTH>
                                <StyledTH style={{ width: '25%'}}>Quantity</StyledTH>
                                <StyledTH style={{ width: '20%'}}>Actions</StyledTH>
                            </tr>
                        </thead>
                        <tbody>
                            {activeDucks.map((duck) => (
                                <tr key={duck.id}>
                                    <StyledTD style={{ width: '10%'}}>{duck.id}</StyledTD>
                                    <StyledTD style={{ width: '25%'}}>{duck.color}</StyledTD>
                                    <StyledTD style={{ width: '10%'}}>{duck.size}</StyledTD>
                                    <StyledTD style={{ width: '10%'}}>{duck.price}</StyledTD>
                                    <StyledTD style={{ width: '25%'}}>{duck.quantity}</StyledTD>
                                    <StyledTD style={{ width: '20%'}}>
                                        <Clickable onClick={() => openDuckForm(true, duck.id)}>
                                            Edit
                                        </Clickable>
                                        &nbsp;/&nbsp;
                                        <Clickable onClick={() => openDeleteForm(duck.id)}>
                                            Delete
                                        </Clickable>
                                    </StyledTD>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </Box>
            </Stack>
            <Modal
                open={modalOpen}
                onClose={() => clearAll()}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet sx={{ padding: '20px', width: '350px' }}>
                    <ModalClose sc={{ m: 2 }} />
                    <Typography level='h2'>{isDelete ? 'Delete Duck' : isEdit ? 'Edit Duck' : 'Add Duck'}</Typography>
                    {isDelete ?
                        <DuckForm
                            del={true}
                            currentDuck={currentDuck}
                            constants={constants}
                            submit={deleteDuck}
                            close={clearAll}
                        />
                        : isEdit ?
                        <DuckForm
                            submit={editDuck}
                            isEdit={true}
                            constants={constants}
                            currentDuck={currentDuck}
                            setCurrentDuck={setCurrentDuck}
                        />
                        :
                        <DuckForm
                            submit={addDuck}
                            constants={constants}
                            currentDuck={currentDuck}
                            setCurrentDuck={setCurrentDuck}
                        />
                    }
                </Sheet>
            </Modal>
        </div>
    )
}

export default Warehouse

const DuckForm = ({ submit, constants: {duckColors, duckSizes}, currentDuck, setCurrentDuck, isEdit = false, del = false, close }) => {
    return (
        <>
            <p>Color: </p>
            <ConstantsDropdown
                disabled={del || isEdit}
                constants={duckColors}
                current={currentDuck && currentDuck.color}
                onChange={(event) => setCurrentDuck({...currentDuck, color: event.target.value})}
            />
            <p>Size: </p>
            <ConstantsDropdown
                disabled={del || isEdit}
                constants={duckSizes}
                current={currentDuck && currentDuck.size}
                onChange={(event) => setCurrentDuck({...currentDuck, size: event.target.value})}
            />
            <p>Quantity: </p>
            <input
                type="number"
                value={currentDuck.quantity || 0}
                disabled={del}
                min="0"
                onChange={(event) => setCurrentDuck({...currentDuck, quantity: event.target.value})}
            />
            <p>Price: </p>
            <input
                type="number"
                value={currentDuck.price || 0}
                disabled={del}
                min="0"
                step="0.01"
                onChange={(event) => setCurrentDuck({...currentDuck, price: event.target.value})}
            />
            <Spacing />
            {del && (
                <>
                    <span>Are you sure you want to delete this duck?</span>
                    <Spacing />
                    <StyledButton onClick={() => close()}>Cancel</StyledButton>
                </>
            )}
            <StyledButton onClick={() => submit()}>Submit</StyledButton>
        </>
    )
}

const ConstantsDropdown = ({constants, current, onChange, disabled}) => {
    return (
        <select value={current} onChange={onChange} disabled={disabled}>
            {Object.keys(constants).map(i => (
                <option key={constants[i].name} value={constants[i].name}>{constants[i].name}</option>
            ))}
        </select>
    )
}

const Clickable = styled.span`
    text-decoration: underline;
    cursor: pointer;
`

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse; 
`

const StyledTH = styled.th`
    padding: 35px;
    color: #fff;
    background-color: #666;
    border: 1px solid #000;
`

const StyledTD = styled.td`
    padding: 35px;
    background-color: #ccc;
    border: 1px solid #000;
    margin: 0 auto;
    text-align: center;
`

const StyledButton = styled.button`
    font-size: 16px;
    border: 1px solid #000;
    padding: 16px 36px;
    margin-right: 5px;
`

const Spacing = styled.div`
    margin-top: 20px;
`
