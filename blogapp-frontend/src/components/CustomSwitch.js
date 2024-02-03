import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const CustomSwitch = withStyles({
    switchBase: {
      color: '#fff',
      '&$checked': {
        color: '#4caf50',
      },
      '&$checked + $track': {
        backgroundColor: '#4caf50',
      },
    },
    checked: {},
    track: {},
  })(Switch);

export default CustomSwitch;