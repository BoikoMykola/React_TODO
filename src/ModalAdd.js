import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 250,
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '30ch',
        },
    },
}));

export default function ModalAdd(props) {
    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);

    const handleClose = () => {
        props.setOpenNew(false);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h3>Добавление нового дела</h3>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={props.handlerSubmit}>
                <TextField name="name" label="Название" variant="outlined" value={props.name}
                           onChange={props.handlerChange}/>
                <TextField
                    name="time"
                    label="Дата/время исполнения"
                    type="datetime-local"
                    value={props.time}
                    variant="outlined"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={props.handlerChange}
                />
                <TextField
                    name="description"
                    label="Описание дела"
                    placeholder="Опишите дело"
                    multiline
                    variant="outlined"
                    value={props.description}
                    onChange={props.handlerChange}
                />
                <TextField name="tags" label="Теги" variant="outlined" value={props.tags}
                           onChange={props.handlerChange}/>
                <TextField name="priority" type="number" label="Приоритет" variant="outlined" value={props.priority}
                           onChange={props.handlerChange}/>
                <br/>
                <Button type="submit" variant="contained" size="large" color="primary">
                    Добавить дело
                </Button>
            </form>

        </div>
    );

    return (
        <div>
            <Modal
                open={props.openNew}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}