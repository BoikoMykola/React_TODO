import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    paper: {
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    root: {
        width: 700,
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function Filter(props) {
    const classes = useStyles();
    const {rows, setRows, openFilter} = props;
    const [rowsOld, setRowsOld] = React.useState(rows);
    const [value, setValue] = React.useState("all");
    const open = Boolean(props.openFilter);
    const id = open ? 'simple-popper' : undefined;

    const handleChange = (event) => {
        setValue(event.target.value);
        setRows(rowsOld);
    };

    const getLimList = () => {
        setRowsOld(rows);

        switch (value) {
            case "day":
                let a = rows.filter(item =>
                    Date.parse(item.time) > Date.now() && Date.parse(item.time) < (Date.now() + 1000 * 60 * 60 * 24)
                );
                setRows(a);
                break;
            case "week":
                let b = rows.filter(item =>
                    Date.parse(item.time) > Date.now() && Date.parse(item.time) < (Date.now() + 1000 * 60 * 60 * 24 * 7)
                );
                setRows(b);
                break;
            case "month":
                let c = rows.filter(item =>
                    Date.parse(item.time) > Date.now() && Date.parse(item.time) < (Date.now() + 1000 * 60 * 60 * 24 * 30)
                );
                setRows(c);
                break;
            case "all":
                setRows(rowsOld);
                break;
            default:
        }
    }

    return (
        <div>
            <Popper id={id} open={open} anchorEl={openFilter}>
                <div className={`${classes.paper} ${classes.root}`}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Сформировать список дел:</FormLabel>
                        <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                            <FormControlLabel value="day" control={<Radio color="primary"/>} label="на день"/>
                            <FormControlLabel value="week" control={<Radio color="primary"/>} label="на неделю"/>
                            <FormControlLabel value="month" control={<Radio color="primary"/>} label="на месяц"/>
                            <FormControlLabel value="all" control={<Radio color="primary"/>} label="полный список"/>
                        </RadioGroup>
                    </FormControl>
                    <br/>
                    <Button variant="contained" size="large" color="primary" onClick={getLimList}>
                        Формировать
                    </Button>
                </div>
            </Popper>
        </div>
    );
}