import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Checkbox from '@material-ui/core/Checkbox';

//Icons
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';


const classes = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoaded: false,
            selected: []
        };
      this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.props.onRequestSort = this.onRequestSort.bind(this);

    }

    componentDidMount() {
        axios.get('api/entries')
          .then(res => {

            this.setState({ data: res.data, isLoaded: true });
          });
    }

    handleSelectAllClick (event, checked) {
      if (checked) {
        this.setState(state => ({ selected: state.data.map(n => n.id) }));
        return;
      }
      this.setState({ selected: [] });
    }

    handleClick (event, id) {
      const { selected } = this.state;
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      this.setState({ selected: newSelected });
    }

    getSorting(order, orderBy) {
      return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    }

    createSortHandler (property, event) {
      this.props.onRequestSort(event, property);
    }


    render() {

        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        if (!this.state.isLoaded) {
            return (<div>Loading...</div>);
         }
        return (
            <Paper className={classes.root}>
               <Table className={classes.table}>
                 <TableHead>
                   <TableRow>
                     <TableCell padding="checkbox">
                             <Checkbox
                               indeterminate={numSelected > 0 && numSelected < rowCount}
                               onChange={this.handleSelectAllClick}
                             />
                     </TableCell>
                     <TableCell key="id" sortDirection={orderBy === 'id' ? order : false}>
                     <Tooltip
                       title="Sort"
                       placement={'bottom-end'}
                       enterDelay={300}
                     >
                       <TableSortLabel
                         active={orderBy === 'id'}
                         direction={order}
                         onClick={this.createSortHandler('id')}
                       >
                         {'#'}
                       </TableSortLabel>
                     </Tooltip>


                     </TableCell>
                     <TableCell>Type</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell numeric>Amount</TableCell>
                     <TableCell numeric>Date Due</TableCell>
                     <TableCell>Actions</TableCell>
                   </TableRow>
                 </TableHead>

                 <TableBody>
                   {this.state.data
                     .sort(this.getSorting(order, orderBy))
                     .map(n => {
                     return (
                       <TableRow key={n.id} hover={true} onClick={event => this.handleClick(event, n.id)}>
                          <TableCell padding="checkbox">
                                  <Checkbox checked={this.state.selected.indexOf(n.id) !== -1}/>
                          </TableCell>
                         <TableCell>
                           {n.id}
                         </TableCell>

                         <TableCell>
                         {n.type ?
                           <Tooltip id="tooltip-icon" title="Income">
                              <ArrowUpward style={{color: 'green'}} />
                           </Tooltip>
                            :
                            <Tooltip id="tooltip-icon" title="Outcome">
                              <ArrowDownward style={{color: 'red'}}/>
                            </Tooltip>


                         }
                         </TableCell>
                         <TableCell>
                           {n.description}
                         </TableCell>
                         <TableCell numeric>
                            {new Intl.NumberFormat('en-GB', {
                                style: 'currency',
                                currency: 'AUD'
                            }).format(n.amount)}
                         </TableCell>
                         <TableCell>{new Date(n.dt_due).toLocaleString('en-AU',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
                        <TableCell>
                            <Tooltip id="tooltip-icon" title="Delete">
                                <IconButton aria-label="Delete">
                                  <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                       </TableRow>
                     );
                   })}
                 </TableBody>
               </Table>
             </Paper>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<Main />, document.getElementById('app'));
}
