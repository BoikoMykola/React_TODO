import React from 'react';
import Popper from '@material-ui/core/Popper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    paper: {
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    root: {
        width: 300,
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function ViewColumn(props) {
    const classes = useStyles();
    const {openView, setState, state} = props;
    const open = Boolean(props.openView);
    const id = open ? 'simple-popper' : undefined;


    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };


    return (
        <div>
            <Popper id={id} open={open} anchorEl={openView}>
                <div className={`${classes.paper} ${classes.root}`}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Отобразить:</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={state.name} onChange={handleChange} name="name"/>}
                                label="Название"
                            />
                            <FormControlLabel
                                control={<Switch checked={state.time} onChange={handleChange} name="time"/>}
                                label="Дата/время исполнения"
                            />
                            <FormControlLabel
                                control={<Switch checked={state.description} onChange={handleChange}
                                                 name="description"/>}
                                label="Описание дела"
                            />
                            <FormControlLabel
                                control={<Switch checked={state.tags} onChange={handleChange} name="tags"/>}
                                label="Теги"
                            />
                            <FormControlLabel
                                control={<Switch checked={state.priority} onChange={handleChange} name="priority"/>}
                                label="Приоритет"
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </Popper>
        </div>
    );
}