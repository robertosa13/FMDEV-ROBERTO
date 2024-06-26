import React, { Component } from 'react';
import { CardContainer } from './styles';
import { Creators as DialogActions } from '../../store/ducks/dialog';
import { Creators as LmsActions } from '../../store/ducks/lms';
import { Creators as DataSourceActions } from '../../store/ducks/data_source';
import { connect } from 'react-redux';
import { default as CustomButton } from '../../styles/Button';
import { ConfigContainer } from '../../styles/ConfigContainer';
import { Header, fontFamily, primaryColor, StatusMsgContainer } from '../../styles/global';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import MonitorIcon from 'react-feather/dist/icons/monitor';
import EditIcon from 'react-feather/dist/icons/settings';
import DeleteIcon from 'react-feather/dist/icons/trash-2';
import PlayIcon from 'react-feather/dist/icons/play';
import FileIcon from 'react-feather/dist/icons/file';
import EyeIcon from 'react-feather/dist/icons/eye';
import CpuIcon from 'react-feather/dist/icons/cpu';
import MoodleConfigDialog from '../MoodleConfigDialog';
import { INDICATORS, ADD_TRAIN, LMS, CSV , CLUSTER} from '../../constants';
import { Creators as ScreenActions } from '../../store/ducks/screen';
import { Creators as IndicatorActions } from '../../store/ducks/indicator';
import DataSourceDialog from '../DataSourceDialog';
import * as moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import { ProgressSpinner } from 'primereact/progressspinner';
import AlertDialog from '../AlertDialog';
import filesize from "filesize";
import PopupComponent from '../PopupComponent/PopupComponent';


const availableLms = { moodle: true };

const url = 'http://127.0.0.1:8000/arquivos'; // ENDPOINT DA INTEGRAÇÃO

//chamada assicrona
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

var clusterItems = []


async function getdata(){
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.message.toString())

  var fileNames = data.message.toString().split(',');
  console.log(fileNames[0])

  // Percorrendo cada nome de arquivo no array
  for (var fileName of fileNames) {

    clusterItems.push({
      data: "/arquivos/",
      name: fileName,
      description: fileName,
    });
  }

}

getdata()

class DataSource extends Component {

  state = {
    selectedItem: null,
    chipSelected: LMS,
    openPopup: false,
    selectedItemName: '',
  }

  componentWillMount() {
    this.props.getDataSource();
  }

  openItemNamePopup = (itemName) => {
    this.setState({ openPopup: true, selectedItemName: itemName });
  }

  closePopup = () => {
    this.setState({ openPopup: false });
  }

  openDialogConfig = (item, event) => {
    if (!availableLms[item.name]) return;

    this.props.setDialog(item.name, {
      ...item,
      version: {
        label: item.version, value: item.version
      }
    })
  }

  openItemNamePopup = (itemName) => {
    this.setState({ openPopup: true, selectedItemName: itemName });
  }
  

  renderCardLMS = (item, idx) => (
    <Card className='lms-card' key={idx} style={{ opacity: availableLms[item.name] ? 1 : .3 }}>
      <CardActionArea>
        <CardContent style={{ color: primaryColor }}>
          <Typography gutterBottom variant="h5" component="h2" style={{ fontFamily: fontFamily }}>
            {item.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" style={{ color: primaryColor, fontFamily: fontFamily, fontSize: '10px' }}>
            Versão: {item.version ? item.version : 'Não disponível'}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ backgroundColor: primaryColor }}>
       <IconButton onClick={this.goToIndicators.bind(this, LMS, item.name, item.description)}>
          <PlayIcon size={20} color={'#FFF'} />
        </IconButton>
        <IconButton onClick={this.openDialogConfig.bind(this, item)}>
          <EditIcon size={20} color={'#FFF'} />
        </IconButton>
      </CardActions>
    </Card>
  )

  renderCardCluster = (item, idx) => (
    <Card className='lms-card' key={idx} style={{ opacity: true ? 1 : .3 }}>
      <CardActionArea>
        <CardContent style={{ color: primaryColor }}>
          <Typography gutterBottom variant="h5" component="h2" style={{ fontFamily: fontFamily }}>
            {item.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" style={{ color: primaryColor, fontFamily: fontFamily, fontSize: '10px' }}>
            Versão: {item.version ? item.version : 'Não disponível'}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ backgroundColor: primaryColor }}>
       <IconButton onClick={this.goToIndicators.bind(this, CLUSTER, item.name, item.description)}>
          <PlayIcon size={20} color={'#FFF'} />
        </IconButton>
        <IconButton onClick={() => this.openItemNamePopup(item.name)}>
          <EyeIcon size={20} color={'#FFF'} />
        </IconButton>
      </CardActions>
    </Card>
  )

  renderCardCSV = (item, idx) => (
    <Card className='lms-card' key={idx}>
      <CardActionArea>
        <CardContent style={{ color: primaryColor }}>
          <Typography gutterBottom variant="h5" component="h2" style={{ fontFamily: fontFamily }}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" style={{ color: primaryColor, fontFamily: fontFamily, fontSize: '10px' }}>
            <b>Importado em:</b> {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" style={{ color: primaryColor, fontFamily: fontFamily, fontSize: '10px' }}>
            <b>Tamanho:</b> {filesize(item.size)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ backgroundColor: primaryColor }}>
        <IconButton onClick={this.goToIndicators.bind(this, CSV, item.id, item.name)}>
          <PlayIcon size={20} color={'#FFF'} />
        </IconButton>
        <IconButton onClick={this.handleMsgDelete.bind(this, item)}>
          <DeleteIcon size={20} color={'#FFF'} />
        </IconButton>
      </CardActions>
    </Card>
  )

  handleMsgDelete = (item, event) => {
    this.setState({ selectedItem: item });

    this.props.setDialog('alert', {
      description: 'Você realmente deseja excluir esta fonte de dados?'
    });
  }

  handleDelete = () => {
    const { selectedItem } = this.state;

    if (!selectedItem || !selectedItem.id) return;

    this.props.deleteDataSource(selectedItem.id);
  }

  goToIndicators = (context, id, name, event) => {
    const key = `${context}/${id}/${name}`;

    if (context === LMS && !availableLms[id]) return;
    this.props.setScreen(ADD_TRAIN, INDICATORS);
    this.props.setIndicator('datasource', key);
    this.props.getIndicators({ context, id });
  }

  setChip = (value, event) => this.setState({ chipSelected: value });

  renderDatasetOptions = () => {
    const { chipSelected } = this.state;

    return (
      <div style={{ display: 'flex', paddingLeft: '2rem' }}>
        <div>
          <Chip
            avatar={<MonitorIcon size={16} color={chipSelected === LMS ? '#FFF' : primaryColor} />}
            label="Ambientes EAD"
            className={chipSelected === LMS ? 'active-chip' : 'inactive-chip'}
            onClick={this.setChip.bind(this, LMS)}
          />
        </div>
        <div style={{ paddingLeft: '.5vw' }}>
          <Chip
            avatar={<FileIcon size={16} color={chipSelected === CSV ? '#FFF' : primaryColor} />}
            label="Arquivos CSV"
            className={chipSelected === CSV ? 'active-chip' : 'inactive-chip'}
            onClick={this.setChip.bind(this, CSV)}
          />
        </div>
        <div style={{ paddingLeft: '.5vw' }}>
          <Chip
            avatar={<CpuIcon size={16} color={chipSelected === CLUSTER ? '#FFF' : primaryColor} />}
            label="Big Data"
            className={chipSelected === CLUSTER ? 'active-chip' : 'inactive-chip'}
            onClick={this.setChip.bind(this, CLUSTER)}
          />
        </div>
      </div>
    )
  }

  addDataSource = () => this.props.setDialog('dataSource');

  render() {
    const { chipSelected } = this.state;
    const { lms, data_source } = this.props;
    const loading = !!data_source.loading;
    const hasData = !!data_source.data.length;

    const { openPopup, selectedItemName } = this.state;

   
     
  

    return (
      <PerfectScrollbar style={{ width: '100%' }}>
        <ConfigContainer style={{ minHeight: '70%' }}>

          <Header>
            <h1>Fontes de Dados</h1>
            <div>
              <CustomButton filled={false} onClick={this.addDataSource}>Adicionar fonte de dados</CustomButton>
            </div>
          </Header>

          {this.renderDatasetOptions()}

          {chipSelected === LMS ?
            <CardContainer>{lms.data.map((item, idx) => this.renderCardLMS(item, idx))}</CardContainer>
            : null}

          {chipSelected === CLUSTER ?
            <CardContainer>{clusterItems.map((item, idx) => this.renderCardCluster(item, idx))}</CardContainer>
            : null}

          {chipSelected === CSV ?
            <CardContainer>{data_source.data.map((item, idx) => this.renderCardCSV(item, idx))}</CardContainer>
            : null}

            

          {chipSelected === CSV && loading && (
            <StatusMsgContainer>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" fill="#EEEEEE" animationDuration=".5s" />
            </StatusMsgContainer>
          )}

          {chipSelected === CSV && !hasData && !loading && (
            <StatusMsgContainer>Nenhuma fonte de dados cadastrada</StatusMsgContainer>
          )}
             <PopupComponent
              isOpen={openPopup}
              handleClose={this.closePopup}
              selectedItemName={this.state.selectedItemName}
            />
        </ConfigContainer>
        <MoodleConfigDialog />
        <DataSourceDialog />
        <AlertDialog onSubmit={this.handleDelete}></AlertDialog>
      </PerfectScrollbar>

 
    );
  }
}

const mapStateToProps = ({ lms, data_source, data_source_cluster }) => ({ lms, data_source, data_source_cluster });

export default connect(
  mapStateToProps, {
  ...DialogActions, ...LmsActions,
  ...ScreenActions, ...IndicatorActions,
  ...DataSourceActions
}
)(DataSource);