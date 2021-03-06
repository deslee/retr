import React, { useCallback, useRef } from 'react'
import { Box, Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setInitialTitle } from '../slices/SprintSlice';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid'

const LandingPage: React.FC = () => {
    const dispatch = useDispatch()
    const input = useRef<HTMLInputElement>(null)
    const history = useHistory();
    const onCreateSprint = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (input.current) {
            const title = input.current.value
            dispatch(setInitialTitle(title))
            const sprintId = uuid().replace(/-/g, '')
            history.push(`/sprints/${sprintId}`)
        }
        return false
    }, [dispatch, input, history])
    return <Box display="flex" alignItems="center" justifyContent="center" height="100vh" width="100vw">
        <Box>
            <Typography variant="h4">Create a sprint</Typography>
            <form onSubmit={onCreateSprint}>
                <Box display="flex" alignItems="center">
                    <TextField inputRef={input} label="Sprint name" />&nbsp;<Button type="submit" color="primary" variant="contained">Create</Button>
                </Box>
            </form>
        </Box>
    </Box>
}

export default LandingPage;