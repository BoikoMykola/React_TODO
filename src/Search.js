import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
}));

export default function Search(props) {
    const {open, openSearch, placement, rows, setRows} = props;
    const classes = useStyles();
    const [value, setValue] = useState("")
    const rowsOld = rows;


    const handlerSearch = (event) => {
        setValue(event.target.value);
        setRows(rowsOld);
        let regexp = event.target.value.toLowerCase();
        let a = rows.filter(item =>
            item.name.toLowerCase().search(regexp) !== -1 ||
            item.time.toLowerCase().search(regexp) !== -1 ||
            item.description.toLowerCase().search(regexp) !== -1 ||
            item.tags.toLowerCase().search(regexp) !== -1 ||
            item.priority.toLowerCase().search(regexp) !== -1
        )
        setRows(a)

    }


    return (
        <div className={classes.root}>
            <Popper open={open} openSearch={openSearch} placement={placement} transition>
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper component="form" className={classes.root}>
                            <IconButton className={classes.iconButton} aria-label="search">
                                <SearchIcon/>
                            </IconButton>
                            <InputBase
                                value={value}
                                onChange={handlerSearch}
                                className={classes.input}
                                placeholder="Search"
                                inputProps={{'aria-label': 'search'}}
                            />
                            <IconButton type="submit" className={classes.iconButton} aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                        </Paper>

                    </Fade>
                )}
            </Popper>


        </div>
    );
}