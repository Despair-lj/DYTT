import cheerio from 'cheerio';

const URI = 'http://api.skyrj.com/Api2/Dy';
const WEB = 'http://skydy.top';

const fetchData = (uri,par={}) => {
    return fetch(uri,par)
        .then(d=>d.json())
        .then(d=>{
            return d
        })
        .catch(err=>{
            return err
        })
}

const getID = (s) => {
    return s.replace('javascript:toPlay(','').replace(')','');
}

const GetHomeData = ()=>fetchData(URI+'/GetHomeData');
const GetVideoInfo = (ID)=>fetchData(URI+`/GetVideoInfo?Id=${ID}`);
const GetSameVideo = (vName,ID)=>fetchData(URI+`/GetSameVideo?vName=${vName}&CurrentVideoId=${ID}`);
const GetDoubanInterests = ({DBID,start=0,count=5})=>fetchData(`https://frodo.douban.com/api/v2/movie/${DBID}/interests?start=${start}&count=${count}&status=done&order_by=latest&apikey=0b2bdeda43b5688921839c8ecb20399b`,{headers:{"User-Agent":"api-client/1 com.douban.movie"}});
const GetPageList = ({pageSize=30,pageIndex=1,Type,Channel='',Area='',Plot='',Year='',orderBy='updatetime'})=>fetchData(URI+`/GetPageList?pageSize=${pageSize}&pageIndex=${pageIndex}&Type=${Type}&Channel=${Channel}&Area=${Area}&Plot=${Plot}&Year=${Year}&orderBy=${orderBy}`);

const GetSearch = async ({pageSize=36,pageIndex=1,SearchKey}) => {
    const html = await fetch(WEB+`/dy/list?s=${SearchKey}&p=${pageIndex}`).then(d=>d.text());
    const $ = cheerio.load(html);
    const data =  $('.hy-video-list li').map((i, el)=>{
        const videopic = $(el).children('.videopic');
        const score = videopic.children('.score');
        return ({
            "ID": getID(videopic.attr('href')),
            "Name": videopic.attr('title'),
            "MovieTitle": score.text(),
            "Cover": videopic.data('original'),
        })
    }).get()
    return data;
}

export {fetchData,GetHomeData,GetVideoInfo,GetSameVideo,GetPageList,GetSearch,GetDoubanInterests}