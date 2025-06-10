import { select as select$1 } from 'd3-selection';
import { extent, groups, ascending, descending, rollups, max, sum } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { format } from 'd3-format';
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale';
import { PCA } from 'ml-pca';
import { UMAP } from 'umap-js';
import { selection, transition, select } from 'd3';
import { timeFormat } from 'd3-time-format';
import { line, pie, arc } from 'd3-shape';
import { dateFormats, labelsOcclusion, legend, getDimensionAggregator } from '@rawgraphs/rawgraphs-core';

var img$7 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='320' height='160'%3e %3crect width='320' height='160' fill='white'/%3e %3ctext x='160' y='5' font-size='5.333333333333333' style='text-anchor: middle%3b'/%3e %3cg transform='translate(17%2c 5)'%3e %3cg fill='none' font-size='10' font-family='sans-serif' text-anchor='left' transform='translate(0%2c 0)'%3e %3cpath class='domain' stroke='currentColor' d='M-6%2c145H0V0H-6'/%3e %3cg class='tick' opacity='1' transform='translate(0%2c145)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c126.875)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c108.75)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c90.625)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c72.5)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c54.375)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c36.25)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c18.125)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c0)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3c/g%3e %3c/g%3e %3cg fill='none' font-size='10' font-family='sans-serif' text-anchor='middle' transform='translate(0%2c 145)'%3e %3cpath class='domain' stroke='currentColor' d='M0%2c6V0H295V6'/%3e %3cg class='tick' opacity='1' transform='translate(0%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(22.692307692307693%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(45.38461538461539%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(68.07692307692308%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(90.76923076923077%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(113.46153846153847%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(136.15384615384616%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(158.84615384615384%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(181.53846153846155%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(204.23076923076923%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(226.92307692307693%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(249.6153846153846%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(272.3076923076923%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(295%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3c/g%3e %3c/g%3e %3ccircle cx='273.8736808911053' cy='74.40196630577006' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='149.96546936590826' cy='60.94777214115873' r='3' fill='%230365a8'/%3e %3ccircle cx='24.97738129026033' cy='46.194956555991226' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='8.358495939070886' cy='42.19106925852386' r='3' fill='%230365a8'/%3e %3ccircle cx='134.62893805667133' cy='96.28347051010246' r='3' fill='%230365a8'/%3e %3ccircle cx='160.53485552955283' cy='72.53436919187398' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='138.08729635025702' cy='84.28367478526316' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='275.4827180004194' cy='95.13788397210972' r='3' fill='%230365a8'/%3e %3ccircle cx='5.397027263144434' cy='66.99220908391978' r='3' fill='%230365a8'/%3e %3ccircle cx='20.78679435237005' cy='85.21126372495291' r='3' fill='%230365a8'/%3e %3ccircle cx='132.92286353401437' cy='107.52659645139859' r='3' fill='%230365a8'/%3e %3ccircle cx='7.776077569522142' cy='66.53164059390448' r='3' fill='%230365a8'/%3e %3ccircle cx='10.633653421441295' cy='47.93041385278086' r='3' fill='%230365a8'/%3e %3ccircle cx='12.325662674901132' cy='97.82388130334378' r='3' fill='%230365a8'/%3e %3ccircle cx='142.1441588107749' cy='68.9361513582352' r='3' fill='%230365a8'/%3e %3ccircle cx='249.87903670518423' cy='128.30573101731792' r='3' fill='%230365a8'/%3e %3ccircle cx='46.46349637517749' cy='88.31492300761872' r='3' fill='%230365a8'/%3e %3ccircle cx='11.079477832941599' cy='55.79927728482929' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='13.896727927289591' cy='78.3052414802071' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='4.808443182475566' cy='78.21256382058364' r='3' fill='%230365a8'/%3e %3ccircle cx='275.62231672183657' cy='78.08294954015865' r='3' fill='%230365a8'/%3e %3ccircle cx='267.0533958941074' cy='115.27848499590678' r='3' fill='%230365a8'/%3e %3ccircle cx='60.90498453020562' cy='65.33374864073825' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='14.012527085832094' cy='42.484815971664254' r='3' fill='%230365a8'/%3e %3ccircle cx='212.025454600032' cy='94.86702249429159' r='3' fill='%230365a8'/%3e %3ccircle cx='137.38751410320017' cy='79.24470518723969' r='3' fill='%230365a8'/%3e %3ccircle cx='276.7138483998731' cy='83.12487497155008' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='59.33132672637574' cy='1.20494824704806' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='261.06622646099197' cy='117.61009030023436' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='248.19335565078185' cy='46.60246870802698' r='3' fill='%230365a8'/%3e %3ccircle cx='4.750652433892311' cy='86.31530620996608' r='3' fill='%230365a8'/%3e %3ccircle cx='149.69369758970214' cy='52.73109872274037' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='64.21748797654703' cy='52.76996737882524' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='11.515429357142752' cy='106.54902815180424' r='3' fill='%230365a8'/%3e %3ccircle cx='40.902413471952826' cy='12.767461103308188' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='209.02395537808238' cy='112.58546733347333' r='3' fill='%230365a8'/%3e %3ccircle cx='274.9674038556771' cy='99.3905578200699' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='1.777337758241187' cy='86.93791976441653' r='3' fill='%230365a8'/%3e %3ccircle cx='45.41039876707984' cy='87.77734334012138' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='264.8908967073647' cy='67.30330932577739' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='205.68584012277796' cy='121.26238313823794' r='3' fill='%230365a8'/%3e %3ccircle cx='212.38031576969206' cy='111.27205520785108' r='3' fill='%230365a8'/%3e %3ccircle cx='274.94239862987826' cy='77.5585101268849' r='3' fill='%230365a8'/%3e %3ccircle cx='261.81637913514334' cy='69.68998679490565' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='204.93166455944137' cy='108.5703340733092' r='3' fill='%230365a8'/%3e %3ccircle cx='9.705922793431842' cy='37.26337732811196' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='249.20747405288134' cy='46.61169708446175' r='3' fill='%230365a8'/%3e %3ccircle cx='268.3100259658669' cy='82.29951593688232' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='23.700103788459863' cy='18.67325067552772' r='3' fill='%230365a8'/%3e %3ccircle cx='141.90979009334902' cy='63.83990979182998' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='134.04023199612058' cy='112.46225364392177' r='3' fill='%230365a8'/%3e %3ccircle cx='255.34829679922663' cy='51.008670328621626' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='143.49100063419672' cy='75.36284897398632' r='3' fill='%230365a8'/%3e %3ccircle cx='215.11270216337246' cy='115.57216409425979' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='5.453510488764989' cy='55.17055670318107' r='3' fill='%230365a8'/%3e %3ccircle cx='226.99842082211802' cy='108.72213028680777' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='134.11771928331163' cy='111.83091424670219' r='3' fill='%230365a8'/%3e %3ccircle cx='215.53308510949887' cy='110.34642622211203' r='3' fill='%230365a8'/%3e %3ccircle cx='276.4617110819865' cy='91.60428501254137' r='3' fill='%230365a8'/%3e %3ccircle cx='17.811617974408986' cy='35.36876667362979' r='3' fill='%230365a8'/%3e %3ccircle cx='208.36818647150338' cy='120.06730457046625' r='3' fill='%230365a8'/%3e %3ccircle cx='276.18629778508074' cy='96.2798942676243' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='10.786852296393782' cy='84.43833776547896' r='3' fill='%230365a8'/%3e %3ccircle cx='59.310711533399584' cy='68.36860385214501' r='3' fill='%230365a8'/%3e %3ccircle cx='264.84875314773126' cy='62.70206658047842' r='3' fill='%230365a8'/%3e %3ccircle cx='196.08605552229565' cy='126.49919665560259' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='27.408446848107463' cy='41.05354540316835' r='3' fill='%230365a8'/%3e %3ccircle cx='257.0519726554794' cy='58.53587390555052' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='5.461173033894366' cy='69.97664443200806' r='3' fill='%230365a8'/%3e %3ccircle cx='67.37922276068774' cy='31.63375891249114' r='3' fill='%230365a8'/%3e %3ccircle cx='21.087477633986808' cy='91.8864426638924' r='3' fill='%230365a8'/%3e %3ccircle cx='7.402419937379039' cy='73.42689327144622' r='3' fill='%230365a8'/%3e %3ccircle cx='59.16924281627122' cy='1.546903868843212' r='3' fill='%230365a8'/%3e %3ccircle cx='215.0121348689453' cy='93.30594242633636' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='269.6625844832433' cy='109.36821484782966' r='3' fill='%230365a8'/%3e %3ccircle cx='146.8341610143131' cy='69.9864403439895' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='140.03696735907164' cy='81.65359578964356' r='3' fill='%230365a8'/%3e %3ccircle cx='250.69829063665037' cy='42.73395446239168' r='3' fill='%230365a8'/%3e %3ccircle cx='34.8685421577594' cy='17.87019304970827' r='3' fill='%230365a8'/%3e %3ccircle cx='271.87288975258883' cy='70.52911357297688' r='3' fill='%230365a8'/%3e %3ccircle cx='261.10704348039906' cy='116.87082995283758' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='34.97387392511166' cy='13.579817947498617' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='266.30457984495985' cy='73.09255332194545' r='3' fill='%230365a8'/%3e %3ccircle cx='219.58594613335288' cy='81.12324539361234' r='3' fill='%230365a8'/%3e %3ccircle cx='23.371121793013632' cy='24.038137518427572' r='3' fill='%230365a8'/%3e %3ccircle cx='68.46638659737903' cy='33.07854340826079' r='3' fill='%230365a8'/%3e %3ccircle cx='65.55189868973761' cy='54.00015477151045' r='3' fill='%230365a8'/%3e %3ccircle cx='28.45632119602194' cy='38.40052734305389' r='3' fill='%230365a8'/%3e %3ccircle cx='17.221790455022134' cy='35.55130853358268' r='3' fill='%230365a8'/%3e %3ccircle cx='11.182093202774496' cy='52.64723801862309' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='5.901167185407984' cy='89.59759009667894' r='3' fill='%230365a8'/%3e %3ccircle cx='18.86993872490133' cy='26.837256352094105' r='3' fill='%230365a8'/%3e %3ccircle cx='66.67120705973099' cy='49.05951980828462' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='12.507533350466135' cy='109.06851058422073' r='3' fill='%230365a8'/%3e %3ccircle cx='163.2633303323012' cy='40.13693011548889' r='3' fill='%230365a8'/%3e %3ccircle cx='2.265396760589349' cy='50.284391595123836' r='3' fill='%230365a8'/%3e %3ccircle cx='203.022653447339' cy='112.76073979452106' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='9.579775646099526' cy='87.42475868825791' r='3' fill='%230365a8'/%3e %3ccircle cx='202.63997174196203' cy='117.39463622322143' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='14.293018826121966' cy='30.93518596774428' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='135.65797718336685' cy='73.90699256568463' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='132.82859135397652' cy='96.09265821165418' r='3' fill='%230365a8'/%3e %3ccircle cx='271.0363348290813' cy='87.85055655847216' r='3' fill='%230365a8'/%3e %3ccircle cx='62.38872083608008' cy='59.606231398240794' r='3' fill='%230365a8'/%3e %3ccircle cx='14.073044500378977' cy='39.83057853670894' r='3' fill='%230365a8'/%3e %3ccircle cx='223.2323287374883' cy='75.52556188826706' r='3' fill='%230365a8'/%3e %3ccircle cx='266.0862450303154' cy='62.89807392403541' r='3' fill='%230365a8'/%3e %3ccircle cx='266.9379002156966' cy='115.70144321344692' r='3' fill='%230365a8'/%3e %3ccircle cx='134.93578735651886' cy='98.23276745487897' r='3' fill='%230365a8'/%3e %3ccircle cx='149.28693433686837' cy='66.57760874862649' r='3' fill='%230365a8'/%3e %3ccircle cx='139.70280058693126' cy='72.43925538149978' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='159.6309786239082' cy='45.59705464601828' r='3' fill='%230365a8'/%3e %3ccircle cx='132.95263232403565' cy='115.46460024526698' r='3' fill='%230365a8'/%3e %3ccircle cx='159.82533017668533' cy='45.274842208986705' r='3' fill='%230365a8'/%3e %3ccircle cx='12.076947271704226' cy='92.7823730806226' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='139.72657320267393' cy='64.52914869997306' r='3' fill='%230365a8'/%3e %3ccircle cx='188.73066580708016' cy='129.18476110569955' r='3' fill='%230365a8'/%3e %3ccircle cx='165.99297789951422' cy='39.236173888485055' r='3' fill='%230365a8'/%3e %3ccircle cx='266.9894331937218' cy='95.19120895866537' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='148.86526690819596' cy='76.7428491340657' r='3' fill='%230365a8'/%3e %3ccircle cx='133.12671647465746' cy='115.16481890402667' r='3' fill='%230365a8'/%3e %3ccircle cx='53.08328299274306' cy='76.37155635709775' r='3' fill='%230365a8'/%3e %3ccircle cx='234.3313056993177' cy='47.0181386341575' r='3' fill='%230365a8'/%3e %3ccircle cx='156.37209125557732' cy='44.678425748673234' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='267.19272646978663' cy='78.32916191981671' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='166.7009598065258' cy='40.4589212957464' r='3' fill='%230365a8'/%3e %3ccircle cx='215.69354038772084' cy='113.75276044258909' r='3' fill='%230365a8'/%3e %3ccircle cx='165.95528976079422' cy='40.84136995358617' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='59.0834936773774' cy='1.4616592766888026' r='3' fill='%230365a8'/%3e %3ccircle cx='22.244193670763142' cy='20.72518672304012' r='3' fill='%230365a8'/%3e %3ccircle cx='257.85559338237044' cy='57.94521885342723' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='58.92422099372109' cy='2.734273202446346' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='20.620153416365195' cy='43.84250769087906' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='215.23406397614917' cy='94.84480258479937' r='3' fill='%230365a8'/%3e %3ccircle cx='33.88569212907148' cy='18.48227507559019' r='3' fill='%230365a8'/%3e %3ccircle cx='145.850096946667' cy='58.39671590643399' r='3' fill='%230365a8'/%3e %3ccircle cx='65.01042632630984' cy='49.96558326903371' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='213.92533876335838' cy='101.11570576861618' r='3' fill='%230365a8'/%3e %3ccircle cx='2.0002393264479594' cy='92.26244308768662' r='3' fill='%230365a8'/%3e %3ccircle cx='228.91240927385297' cy='48.78529015447973' r='3' fill='%230365a8'/%3e %3ccircle cx='133.82095911794408' cy='93.30672727846228' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='5.204770633907305' cy='54.44083821531348' r='3' fill='%230365a8'/%3e %3ccircle cx='58.98489585823845' cy='1.4040309084316227' r='3' fill='%230365a8'/%3e %3ccircle cx='249.98093103145226' cy='48.184590948146464' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='61.18363951919209' cy='12.084341658514566' r='3' fill='%230365a8'/%3e %3ccircle cx='230.17447659343685' cy='69.74703231783127' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='11.290043507944576' cy='50.790128781957286' r='3' fill='%230365a8'/%3e %3ccircle cx='213.96680271750068' cy='117.27721297351978' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='147.89601562699377' cy='64.81652890126813' r='3' fill='%230365a8'/%3e %3ccircle cx='7.031242101294424' cy='101.82464057897171' r='3' fill='%230365a8'/%3e %3ccircle cx='275.26069093499837' cy='86.54400677402135' r='3' fill='%230365a8'/%3e %3ccircle cx='265.146207209418' cy='119.13970074095926' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='147.66480191470805' cy='69.31716074777874' r='3' fill='%230365a8'/%3e %3ccircle cx='205.2970340444743' cy='107.94506899329689' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='261.2508672597341' cy='119.92645090654501' r='3' fill='%230365a8'/%3e %3ccircle cx='214.59489658839144' cy='105.7312744825121' r='3' fill='%230365a8'/%3e %3ccircle cx='6.294438629405335' cy='97.09663860817648' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='12.351342066942545' cy='95.7307558996213' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='64.16969175315917' cy='52.958825175284176' r='3' fill='%230365a8'/%3e %3ccircle cx='142.03475048818441' cy='78.99887768016929' r='3' fill='%230365a8'/%3e %3ccircle cx='249.34279434585167' cy='40.808633088011796' r='3' fill='%230365a8'/%3e %3ccircle cx='270.6294634702203' cy='84.06506044775273' r='3' fill='%230365a8'/%3e %3ccircle cx='28.989521001445524' cy='22.096014073733727' r='3' fill='%230365a8'/%3e %3ccircle cx='209.26836871786233' cy='96.79925808449902' r='3' fill='%230365a8'/%3e %3ccircle cx='3.902208130632246' cy='48.58593238754574' r='3' fill='%230365a8'/%3e %3ccircle cx='188.2057379339547' cy='128.58738260807044' r='3' fill='%230365a8'/%3e %3ccircle cx='133.11157167562592' cy='115.17697227577314' r='3' fill='%230365a8'/%3e %3ccircle cx='214.70260926697094' cy='86.05493945385011' r='3' fill='%230365a8'/%3e %3ccircle cx='44.4147790661118' cy='90.75106021018996' r='3' fill='%230365a8'/%3e %3ccircle cx='54.03463048943922' cy='76.43888502049248' r='3' fill='%230365a8'/%3e %3ccircle cx='244.51894244000832' cy='36.55824601501418' r='3' fill='%230365a8'/%3e %3ccircle cx='230.15382483724883' cy='59.16243705343981' r='3' fill='%230365a8'/%3e %3ccircle cx='155.5541466377796' cy='48.3001415170008' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='5.094456259314035' cy='44.838247987746364' r='3' fill='%230365a8'/%3e %3ccircle cx='264.4499742438464' cy='110.20503602155719' r='3' fill='%230365a8'/%3e %3ccircle cx='210.69187419564446' cy='120.05625223349307' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='31.349970411908593' cy='11.489712654058382' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='256.4425956120276' cy='122.88382711686565' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='3.8178819450592294' cy='95.2652784407065' r='3' fill='%230365a8'/%3e %3ccircle cx='244.53920278485626' cy='35.230858327636874' r='3' fill='%230365a8'/%3e %3ccircle cx='273.01488800578176' cy='99.52574519224417' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='207.61858921531484' cy='114.86353635091156' r='3' fill='%230365a8'/%3e %3ccircle cx='238.59208965816217' cy='39.62006075609406' r='3' fill='%230365a8'/%3e %3ccircle cx='122.62282801773063' cy='120.82690611727132' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='7.878261974571921' cy='81.06045814426558' r='3' fill='%230365a8'/%3e %3ccircle cx='150.79663466511772' cy='58.11006470033386' r='3' fill='%230365a8'/%3e %3ccircle cx='30.553442227318897' cy='17.452208904912922' r='3' fill='%230365a8'/%3e %3ccircle cx='126.53434337991361' cy='119.64432422660805' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='218.9447348331046' cy='82.27116516206097' r='3' fill='%230365a8'/%3e %3ccircle cx='12.015526940050776' cy='93.05890457614018' r='3' fill='%230365a8'/%3e %3ccircle cx='132.3415813701124' cy='74.4433046210467' r='3' fill='%230365a8'/%3e %3ccircle cx='269.1900475745739' cy='97.03693528498731' r='3' fill='%230365a8'/%3e %3ccircle cx='271.6723316503875' cy='103.44834546972702' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='29.08690754326674' cy='12.88663858320467' r='3' fill='%230365a8'/%3e %3ccircle cx='232.45351546657' cy='50.449394029284804' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='66.45133269496905' cy='44.32183187886386' r='3' fill='%230365a8'/%3e %3ccircle cx='269.12945495688507' cy='69.3638333292221' r='3' fill='%230365a8'/%3e %3ccircle cx='31.854198522901843' cy='81.83511294832655' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='212.86894539596736' cy='105.45442404977764' r='3' fill='%23ff7f0e'/%3e %3ccircle cx='18.168699596801126' cy='30.804787060311547' r='3' fill='%230365a8'/%3e %3c/g%3e%3c/svg%3e";

var img$6 = "data:image/svg+xml,%3csvg id='rawgraphs-icons' xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3e %3cdefs%3e %3cstyle%3e .cls-1 %7b fill: %23df88ff%3b %7d .cls-2 %7b fill: %23ad00ff%3b %7d %3c/style%3e %3c/defs%3e %3cg id='secundary'%3e %3ccircle class='cls-1' cx='22.5' cy='39.5' r='3.5'/%3e %3ccircle class='cls-1' cx='17' cy='20' r='6'/%3e %3ccircle class='cls-1' cx='41.5' cy='37.5' r='2.5'/%3e %3c/g%3e %3cg id='primary'%3e %3cpolygon class='cls-2' points='46.305 46.805 44.865 46.805 46.061 48 8 48 8 9.939 9.195 11.135 9.195 9.695 7.5 8 5.805 9.695 5.805 11.135 7 9.939 7 49 46.061 49 44.865 50.195 46.305 50.195 48 48.5 46.305 46.805'/%3e %3ccircle class='cls-2' cx='31.5' cy='28.5' r='6.5'/%3e %3ccircle class='cls-2' cx='37.5' cy='15.5' r='3.5'/%3e %3c/g%3e%3c/svg%3e";

const metadata$3 = {
  name: 'Similarity Map',
  id: 'rawgraphs.similaritymap',
  categories: ['Dimension Reduction', 'Clustering'],
  description: 'Similarity of high dimensional data points is rendered in two dimensions via clustering. Different choices for a dimensionality reduction can be selected.',
  code: 'https://observablehq.com/',
  tutorial: 'https://rawgraphs.io/learning/',
  thumbnail: img$7,
  icon: img$6
};

const dimensions$3 = [{
  id: 'dimensions',
  name: 'Dimensions',
  validTypes: ['number'],
  required: true,
  multiple: true,
  operation: 'get'
}, {
  id: "labels",
  name: 'Hover Labels',
  validTypes: ['string', 'number'],
  required: false
}, {
  id: 'classification',
  name: 'Classification',
  validTypes: ['string', 'number'],
  required: false
}];

const mapData$3 = {
  dimensions: 'get',
  classification: 'get',
  labels: 'get'
};

function allTSNEE(opt) {
  // utility function
  var assert = function (condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  };

  // syntax sugar
  var getopt = function (opt, field, defaultval) {
    if (opt.hasOwnProperty(field)) {
      return opt[field];
    } else {
      return defaultval;
    }
  };

  // return 0 mean unit standard deviation random number
  var return_v = false;
  var v_val = 0.0;
  var gaussRandom = function () {
    if (return_v) {
      return_v = false;
      return v_val;
    }
    var u = 2 * Math.random() - 1;
    var v = 2 * Math.random() - 1;
    var r = u * u + v * v;
    if (r == 0 || r > 1) return gaussRandom();
    var c = Math.sqrt(-2 * Math.log(r) / r);
    v_val = v * c; // cache this for next function call for efficiency
    return_v = true;
    return u * c;
  };

  // return random normal number
  var randn = function (mu, std) {
    return mu + gaussRandom() * std;
  };

  // utilitity that creates contiguous vector of zeros of size n
  var zeros = function (n) {
    if (typeof n === 'undefined' || isNaN(n)) {
      return [];
    }
    if (typeof ArrayBuffer === 'undefined') {
      // lacking browser support
      var arr = new Array(n);
      for (var i = 0; i < n; i++) {
        arr[i] = 0;
      }
      return arr;
    } else {
      return new Float64Array(n); // typed arrays are faster
    }
  };

  // utility that returns 2d array filled with random numbers
  // or with value s, if provided
  var randn2d = function (n, d, s) {
    var uses = typeof s !== 'undefined';
    var x = [];
    for (var i = 0; i < n; i++) {
      var xhere = [];
      for (var j = 0; j < d; j++) {
        if (uses) {
          xhere.push(s);
        } else {
          xhere.push(randn(0.0, 1e-4));
        }
      }
      x.push(xhere);
    }
    return x;
  };

  // compute L2 distance between two vectors
  var L2 = function (x1, x2) {
    var D = x1.length;
    var d = 0;
    for (var i = 0; i < D; i++) {
      var x1i = x1[i];
      var x2i = x2[i];
      d += (x1i - x2i) * (x1i - x2i);
    }
    return d;
  };

  // compute pairwise distance in all vectors in X
  var xtod = function (X) {
    var N = X.length;
    var dist = zeros(N * N); // allocate contiguous array
    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        var d = L2(X[i], X[j]);
        dist[i * N + j] = d;
        dist[j * N + i] = d;
      }
    }
    return dist;
  };

  // compute (p_{i|j} + p_{j|i})/(2n)
  var d2p = function (D, perplexity, tol) {
    var Nf = Math.sqrt(D.length); // this better be an integer
    var N = Math.floor(Nf);
    assert(N === Nf, "D should have square number of elements.");
    var Htarget = Math.log(perplexity); // target entropy of distribution
    var P = zeros(N * N); // temporary probability matrix

    var prow = zeros(N); // a temporary storage compartment
    for (var i = 0; i < N; i++) {
      var betamin = -Infinity;
      var betamax = Infinity;
      var beta = 1; // initial value of precision
      var done = false;
      var maxtries = 50;

      // perform binary search to find a suitable precision beta
      // so that the entropy of the distribution is appropriate
      var num = 0;
      while (!done) {
        //debugger;

        // compute entropy and kernel row with beta precision
        var psum = 0.0;
        for (var j = 0; j < N; j++) {
          var pj = Math.exp(-D[i * N + j] * beta);
          if (i === j) {
            pj = 0;
          } // we dont care about diagonals
          prow[j] = pj;
          psum += pj;
        }
        // normalize p and compute entropy
        var Hhere = 0.0;
        for (var j = 0; j < N; j++) {
          if (psum == 0) {
            var pj = 0;
          } else {
            var pj = prow[j] / psum;
          }
          prow[j] = pj;
          if (pj > 1e-7) Hhere -= pj * Math.log(pj);
        }

        // adjust beta based on result
        if (Hhere > Htarget) {
          // entropy was too high (distribution too diffuse)
          // so we need to increase the precision for more peaky distribution
          betamin = beta; // move up the bounds
          if (betamax === Infinity) {
            beta = beta * 2;
          } else {
            beta = (beta + betamax) / 2;
          }
        } else {
          // converse case. make distrubtion less peaky
          betamax = beta;
          if (betamin === -Infinity) {
            beta = beta / 2;
          } else {
            beta = (beta + betamin) / 2;
          }
        }

        // stopping conditions: too many tries or got a good precision
        num++;
        if (Math.abs(Hhere - Htarget) < tol) {
          done = true;
        }
        if (num >= maxtries) {
          done = true;
        }
      }

      // console.log('data point ' + i + ' gets precision ' + beta + ' after ' + num + ' binary search steps.');
      // copy over the final prow to P at row i
      for (var j = 0; j < N; j++) {
        P[i * N + j] = prow[j];
      }
    } // end loop over examples i

    // symmetrize P and normalize it to sum to 1 over all ij
    var Pout = zeros(N * N);
    var N2 = N * 2;
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        Pout[i * N + j] = Math.max((P[i * N + j] + P[j * N + i]) / N2, 1e-100);
      }
    }
    return Pout;
  };

  // helper function
  function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  var tSNE = function (opt) {
    var opt = opt || {};
    this.perplexity = getopt(opt, "perplexity", 30); // effective number of nearest neighbors
    this.dim = getopt(opt, "dim", 2); // by default 2-D tSNE
    this.epsilon = getopt(opt, "epsilon", 10); // learning rate

    this.iter = 0;
  };
  tSNE.prototype = {
    // this function takes a set of high-dimensional points
    // and creates matrix P from them using gaussian kernel
    initDataRaw: function (X) {
      var N = X.length;
      var D = X[0].length;
      assert(N > 0, " X is empty? You must have some data!");
      assert(D > 0, " X[0] is empty? Where is the data?");
      var dists = xtod(X); // convert X to distances using gaussian kernel
      this.P = d2p(dists, this.perplexity, 1e-4); // attach to object
      this.N = N; // back up the size of the dataset
      this.initSolution(); // refresh this
    },
    // this function takes a given distance matrix and creates
    // matrix P from them.
    // D is assumed to be provided as a list of lists, and should be symmetric
    initDataDist: function (D) {
      var N = D.length;
      assert(N > 0, " X is empty? You must have some data!");
      // convert D to a (fast) typed array version
      var dists = zeros(N * N); // allocate contiguous array
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          var d = D[i][j];
          dists[i * N + j] = d;
          dists[j * N + i] = d;
        }
      }
      this.P = d2p(dists, this.perplexity, 1e-4);
      this.N = N;
      this.initSolution(); // refresh this
    },
    // (re)initializes the solution to random
    initSolution: function () {
      // generate random solution to t-SNE
      this.Y = randn2d(this.N, this.dim); // the solution
      this.gains = randn2d(this.N, this.dim, 1.0); // step gains to accelerate progress in unchanging directions
      this.ystep = randn2d(this.N, this.dim, 0.0); // momentum accumulator
      this.iter = 0;
    },
    // return pointer to current solution
    getSolution: function () {
      return this.Y;
    },
    // perform a single step of optimization to improve the embedding
    step: function () {
      this.iter += 1;
      var N = this.N;
      var cg = this.costGrad(this.Y); // evaluate gradient
      var cost = cg.cost;
      var grad = cg.grad;

      // perform gradient step
      var ymean = zeros(this.dim);
      for (var i = 0; i < N; i++) {
        for (var d = 0; d < this.dim; d++) {
          var gid = grad[i][d];
          var sid = this.ystep[i][d];
          var gainid = this.gains[i][d];

          // compute gain update
          var newgain = sign(gid) === sign(sid) ? gainid * 0.8 : gainid + 0.2;
          if (newgain < 0.01) newgain = 0.01; // clamp
          this.gains[i][d] = newgain; // store for next turn

          // compute momentum step direction
          var momval = this.iter < 250 ? 0.5 : 0.8;
          var newsid = momval * sid - this.epsilon * newgain * grad[i][d];
          this.ystep[i][d] = newsid; // remember the step we took

          // step!
          this.Y[i][d] += newsid;
          ymean[d] += this.Y[i][d]; // accumulate mean so that we can center later
        }
      }

      // reproject Y to be zero mean
      for (var i = 0; i < N; i++) {
        for (var d = 0; d < this.dim; d++) {
          this.Y[i][d] -= ymean[d] / N;
        }
      }

      //if(this.iter%100===0) console.log('iter ' + this.iter + ', cost: ' + cost);
      return cost; // return current cost
    },
    // for debugging: gradient check
    debugGrad: function () {
      var N = this.N;
      var cg = this.costGrad(this.Y); // evaluate gradient
      cg.cost;
      var grad = cg.grad;
      var e = 1e-5;
      for (var i = 0; i < N; i++) {
        for (var d = 0; d < this.dim; d++) {
          var yold = this.Y[i][d];
          this.Y[i][d] = yold + e;
          var cg0 = this.costGrad(this.Y);
          this.Y[i][d] = yold - e;
          var cg1 = this.costGrad(this.Y);
          var analytic = grad[i][d];
          var numerical = (cg0.cost - cg1.cost) / (2 * e);
          console.log(i + ',' + d + ': gradcheck analytic: ' + analytic + ' vs. numerical: ' + numerical);
          this.Y[i][d] = yold;
        }
      }
    },
    // return cost and gradient, given an arrangement
    costGrad: function (Y) {
      var N = this.N;
      var dim = this.dim; // dim of output space
      var P = this.P;
      var pmul = this.iter < 100 ? 4 : 1; // trick that helps with local optima

      // compute current Q distribution, unnormalized first
      var Qu = zeros(N * N);
      var qsum = 0.0;
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          var dsum = 0.0;
          for (var d = 0; d < dim; d++) {
            var dhere = Y[i][d] - Y[j][d];
            dsum += dhere * dhere;
          }
          var qu = 1.0 / (1.0 + dsum); // Student t-distribution
          Qu[i * N + j] = qu;
          Qu[j * N + i] = qu;
          qsum += 2 * qu;
        }
      }
      // normalize Q distribution to sum to 1
      var NN = N * N;
      var Q = zeros(NN);
      for (var q = 0; q < NN; q++) {
        Q[q] = Math.max(Qu[q] / qsum, 1e-100);
      }
      var cost = 0.0;
      var grad = [];
      for (var i = 0; i < N; i++) {
        var gsum = new Array(dim); // init grad for point i
        for (var d = 0; d < dim; d++) {
          gsum[d] = 0.0;
        }
        for (var j = 0; j < N; j++) {
          cost += -P[i * N + j] * Math.log(Q[i * N + j]); // accumulate cost (the non-constant portion at least...)
          var premult = 4 * (pmul * P[i * N + j] - Q[i * N + j]) * Qu[i * N + j];
          for (var d = 0; d < dim; d++) {
            gsum[d] += premult * (Y[i][d] - Y[j][d]);
          }
        }
        grad.push(gsum);
      }
      return {
        cost: cost,
        grad: grad
      };
    }
  };
  return new tSNE(opt);
}

class PCAAnalysis {
  fit(data) {
    try {
      const pca = new PCA(data);
      const reducedDataObject = pca.predict(data, {
        nComponents: 2
      });

      // Extract the data from the object returned by PCA.predict
      const reducedData = reducedDataObject.data ? reducedDataObject.data.map(row => Array.from(row)) : [];
      return reducedData;
    } catch (error) {
      console.error('Error in PCA fit:', error);
      return [];
    }
  }
}

class UMAPAnalysis {
  fit(data) {
    try {
      const umap = new UMAP({
        nComponents: 2
      });
      const reducedDataObject = umap.fit(data);

      // Ensure the reduced data is in a 2D array format
      const reducedData = Array.isArray(reducedDataObject) ? reducedDataObject : [];
      return reducedData;
    } catch (error) {
      console.error('Error in UMAP fit:', error);
      return [];
    }
  }
}

selection.prototype.styles = styles$2;
transition.prototype.styles = styles$2;

//other approach
// export const multiStyles = function (styles) {
//   return function (selection) {
//     for (const property in styles) {
//       selection.style(property, styles[property])
//     }
//   }
// }

//adapted from https://github.com/gka/d3-jetpack/blob/master/src/st.js
function styles$2(name, value) {
  if (typeof name == 'object') {
    for (var key in name) {
      addStyle(this, key, name[key]);
    }
    return this;
  } else if (typeof name === 'function') {
    return this.each(styleFunction(name));
  } else {
    return arguments.length == 1 ? this.style(name) : addStyle(this, name, value);
  }
  function addStyle(sel, style, value) {
    style = style.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
    var pxStyles = 'top left bottom right padding-top padding-left padding-bottom padding-right border-top b-width border-left-width border-botto-width m border-right-width margin-top margin-left margin-bottom margin-right font-size width stroke-width line-height margin padding border border-radius max-width min-width max-height min-height';
    if (~pxStyles.indexOf(style)) {
      sel.style(style, typeof value == 'function' ? wrapPx(value) : addPx(value));
    } else {
      sel.style(style, value);
    }
    return sel;
  }
  function addPx(d) {
    return d.match ? d : d + 'px';
  }
  function wrapPx(fn) {
    return function () {
      var val = fn.apply(this, arguments);
      return addPx(val);
    };
  }
  function styleFunction(value) {
    return function () {
      var v = value.apply(this, arguments);
      for (var key in v) {
        addStyle(select(this), key, v[key]);
      }
    };
  }
}

function render$3(node, data, visualOptions, mapping) {
  // Destructure visualOptions
  const {
    width,
    height,
    marginLeft,
    marginRight,
    marginBottom,
    marginTop,
    background,
    dotsRadius,
    colorScale,
    title,
    epsilon,
    perplexity,
    tickLabelsVisible,
    analysisMethod // Add analysisMethod to choose between TSNE, PCA, and UMAP
  } = visualOptions;
  const {
    titleSize,
    boundWidth,
    boundHeight,
    boundLeft,
    boundTop,
    xAccessor,
    yAccessor,
    reducedDimensions,
    reducedDimensionsClassified
  } = calcProps();
  const xDimension = reducedDimensions.map(point => point[0]);
  const yDimension = reducedDimensions.map(point => point[1]);
  const svg = select$1(node);
  const bounds = createBounds();
  const {
    xScale,
    yScale
  } = createScales();
  createAxes();
  drawScatterPoints();
  function calcProps() {
    const minTitleHeight = 300;
    const titleSize = height / 30;
    let boundWidth = width - marginLeft - marginRight;
    let boundHeight = height - marginTop - marginBottom;
    let boundLeft = marginLeft + 12; // lr: why the +12? -> the standard marginLeft parameter is not transferred from visualOptions.js in sandbox
    let boundTop = boundHeight >= minTitleHeight ? marginTop + titleSize : marginTop;
    if (boundHeight >= minTitleHeight) {
      boundHeight -= titleSize;
    }
    const xAccessor = d => d[0];
    const yAccessor = d => d[1];
    const {
      reducedDimensions,
      reducedDimensionsClassified
    } = calcReducedDimensions();
    return {
      minTitleHeight,
      titleSize,
      boundWidth,
      boundHeight,
      boundLeft,
      boundTop,
      xAccessor,
      yAccessor,
      reducedDimensions,
      reducedDimensionsClassified
    };
  }

  // function calcReducedDimensions() {
  //   let reducedDimensions, reducedDimensionsClassified;
  //   if (analysisMethod === 'PCA') {
  //     const pca = new PCAAnalysis();
  //     reducedDimensions = pca.fit(data.map(row => row.dimensions));
  //   } else if (analysisMethod === 'UMAP') {
  //     const umap = new UMAPAnalysis();
  //     reducedDimensions = umap.fit(data.map(row => row.dimensions));
  //   } else { // default to TSNE
  //     const opt = { dim: 2, epsilon, perplexity };
  //     var tsne = allTSNEE(opt);
  //     const tsneData = data.map(row => row.dimensions);

  //     tsne.initDataRaw(tsneData);

  //     for (var k = 0; k < 500; k++) {
  //       tsne.step(); // every time you call this, solution gets better
  //     }

  //     reducedDimensions = tsne.getSolution(); // Y is an array of 2-D points that you can plot
  //   }

  //   reducedDimensionsClassified = reducedDimensions.map((e, i) => {
  //     let classification = undefined;
  //     let label = undefined;
  //     if (data[i] && data[i].classification) {
  //       classification = data[i].classification;
  //     }
  //     if (data[i] && data[i].labels) {
  //       label = data[i].labels;
  //     }
  //     return { reducedDimension: e, classification, label };
  //   });

  //   return { reducedDimensions, reducedDimensionsClassified };
  // }

  // Change TSNE initialization to be based on PCA" :
  function calcReducedDimensions() {
    let reducedDimensions, reducedDimensionsClassified;
    const dimensionsData = data.map(row => row.dimensions);
    if (analysisMethod === 'PCA') {
      const pca = new PCAAnalysis();
      reducedDimensions = pca.fit(dimensionsData);
    } else if (analysisMethod === 'UMAP') {
      const umap = new UMAPAnalysis();
      reducedDimensions = umap.fit(dimensionsData);
    } else {
      // default to TSNE
      const pca = new PCAAnalysis();
      const pcaResult = pca.fit(dimensionsData); // Perform PCA first

      const tsne = allTSNEE({
        dim: 2,
        epsilon,
        perplexity,
        seed: 1234
      }); // Add a seed parameter

      tsne.initDataRaw(pcaResult); // Use PCA results as input for t-SNE

      for (let k = 0; k < 500; k++) {
        tsne.step(); // every time you call this, solution gets better
      }
      reducedDimensions = tsne.getSolution(); // Y is an array of 2-D points that you can plot
    }
    reducedDimensionsClassified = reducedDimensions.map((e, i) => {
      let classification = undefined;
      let label = undefined;
      if (data[i] && data[i].classification) {
        classification = data[i].classification;
      }
      if (data[i] && data[i].labels) {
        label = data[i].labels;
      }
      return {
        reducedDimension: e,
        classification,
        label
      };
    });
    return {
      reducedDimensions,
      reducedDimensionsClassified
    };
  }
  function createBounds() {
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', background);
    if (titleSize) {
      svg.append('text').text(title).attr('x', width / 2).attr('y', marginTop).style("text-anchor", "middle").attr("font-size", titleSize);
    }
    return svg.append("g").attr("transform", `translate(${boundLeft}, ${boundTop})`);
  }
  function createScales() {
    const xScale = scaleLinear().domain(extent(xDimension)).range([0, boundWidth]).nice();
    const yScale = scaleLinear().domain(extent(yDimension)).range([boundHeight, 0]).nice();
    return {
      xScale,
      yScale
    };
  }
  function createAxes() {
    const yAxisGenerator = axisLeft().scale(yScale).tickFormat(format(".1e"));
    const yAxis = bounds.append("g").call(yAxisGenerator).attr("text-anchor", "left");
    yAxis.attr("transform", `translate(${0}, 0)`);
    yAxis.selectAll("text").attr("transform", `translate(${0}, 0)`).style("text-anchor", "end");
    const xAxisGenerator = axisBottom().scale(xScale).tickFormat(format(".1e"));
    const xAxis = bounds.append("g").call(xAxisGenerator).attr("transform", `translate(${0}, ${boundHeight})`);
    if (!tickLabelsVisible) {
      yAxis.selectAll("text").remove();
      xAxis.selectAll("text").remove();
    }
    return {
      xAxis,
      yAxis
    };
  }
  function drawScatterPoints() {
    const dots = bounds.selectAll("circle").data(reducedDimensionsClassified);
    function mouseOver(e, d) {
      const x = e.target.cx.animVal.value;
      const y = e.target.cy.animVal.value - 20;
      bounds.append("text").attr("x", x).attr("y", y).attr("font-size", 30).attr("class", "similarity-map-point-label").text(d.label);
      console.log(d.label);
    }
    function mouseOut(e, d) {
      bounds.select(".similarity-map-point-label").remove();
    }
    dots.join("circle").attr("cx", d => xScale(xAccessor(d.reducedDimension))).attr("cy", d => yScale(yAccessor(d.reducedDimension))).attr("r", dotsRadius).attr("fill", d => d.classification ? colorScale(d.classification) : "#0365a8").on('mouseover', mouseOver).on('mouseout', mouseOut);
    return dots;
  }
}

const visualOptions$3 = {
  //artboard
  title: {
    type: "text",
    label: "Chart title",
    default: "",
    group: "artboard"
  },
  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 50,
    group: 'artboard'
  },
  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 50,
    group: 'artboard'
  },
  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 50,
    group: 'artboard'
  },
  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 50,
    group: 'artboard'
  },
  analysisMethod: {
    type: 'text',
    label: 'Reduction Method',
    options: [{
      label: 'PCA',
      value: 'PCA'
    }, {
      label: 'UMAP',
      value: 'UMAP'
    }, {
      label: 't-SNE',
      value: 'TSNE'
    }],
    default: 'PCA',
    group: 'Dimensionality Reduction'
  },
  //parameter
  epsilon: {
    // epsilon is learning rate (10 = default)
    type: 'number',
    label: 'Epsilon',
    default: 10,
    group: 't-SNE',
    disabled: {
      analysisMethod: 'PCA'
    }
  },
  perplexity: {
    // roughly how many neighbors each point influences (30 = default)
    type: 'number',
    label: 'Perplexity',
    default: 30,
    group: 't-SNE',
    disabled: {
      analysisMethod: 'PCA'
    }
  },
  //chart
  dotsRadius: {
    type: 'number',
    label: 'Dots radius',
    default: 5,
    group: 'chart'
  },
  //color
  colorScale: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'classification',
    default: {
      scaleType: 'ordinal',
      interpolator: 'interpolateSpectral'
    },
    group: 'color'
  }
};

var styles$1 = {"axisLabel":{"fontFamily":"Arial, sans-serif","fontSize":"12px","fill":"#7b7b7b","fontWeight":"bold"},"axisLine":{"stroke":"#ccc"},"labelPrimary":{"fontFamily":"Arial, sans-serif","fontSize":"10px","fill":"black","fontWeight":"bold"},"labelSecondary":{"fontFamily":"Arial, sans-serif","fontSize":"10px","fill":"black","fontWeight":"normal"},"labelItalic":{"fontFamily":"Arial, sans-serif","fontSize":"10px","fill":"black","fontWeight":"normal","fontStyle":"italic"},"seriesLabel":{"fontFamily":"Arial, sans-serif","fontSize":"12px","fill":"black","fontWeight":"bold","dominantBaseline":"hanging"},"labelOutline":{"strokeWidth":"2px","paintOrder":"stroke","stroke":"white","strokeLinecap":"round","strokeLinejoin":"round"}};

var similaritymap = {
  metadata: metadata$3,
  dimensions: dimensions$3,
  mapData: mapData$3,
  render: render$3,
  visualOptions: visualOptions$3,
  styles: styles$1
};

var img$5 = "data:image/svg+xml,%3csvg id='rawgraphs-icons' xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3e %3cdefs%3e %3cstyle%3e .cls-1 %7b fill: %23df88ff%3b %7d .cls-2 %7b fill: %23ad00ff%3b %7d .cls-3 %7b stroke: %23521668%3b stroke-width: 1%3b %7d %3c/style%3e %3c/defs%3e %3c!-- Connecting lines --%3e %3cg id='lines'%3e %3cline class='cls-3' x1='31.5' y1='28.5' x2='37.5' y2='15.5'/%3e %3cline class='cls-3' x1='37.5' y1='15.5' x2='17' y2='20'/%3e %3cline class='cls-3' x1='17' y1='20' x2='22.5' y2='39.5'/%3e %3cline class='cls-3' x1='22.5' y1='39.5' x2='41.5' y2='37.5'/%3e %3c/g%3e %3cg id='secondary'%3e %3ccircle class='cls-1' cx='22.5' cy='39.5' r='1.5'/%3e %3ccircle class='cls-1' cx='17' cy='20' r='3'/%3e %3ccircle class='cls-1' cx='41.5' cy='37.5' r='2.5'/%3e %3c/g%3e %3cg id='primary'%3e %3cpolygon class='cls-2' points='46.305 46.805 44.865 46.805 46.061 48 8 48 8 9.939 9.195 11.135 9.195 9.695 7.5 8 5.805 9.695 5.805 11.135 7 9.939 7 49 46.061 49 44.865 50.195 46.305 50.195 48 48.5 46.305 46.805'/%3e %3ccircle class='cls-2' cx='31.5' cy='28.5' r='2'/%3e %3ccircle class='cls-2' cx='37.5' cy='15.5' r='1.5'/%3e %3c/g%3e%3c/svg%3e";

var img$4 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='320' height='160'%3e %3crect width='320' height='160' x='0' y='0' fill='white' id='background'/%3e %3cg id='series'%3e %3cg transform='translate(0%2c0)'%3e %3cg transform='translate(5%2c5)' clip-path='url(%23serieClipPath)'%3e %3cg id='axis'%3e %3cg transform='translate(0%2c150)' fill='none' font-size='10' font-family='sans-serif' text-anchor='middle'%3e %3cpath class='domain' stroke='currentColor' d='M0%2c6V0H310V6'/%3e %3cg class='tick' opacity='1' transform='translate(0%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e70%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(22%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e71%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(44%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e72%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(66%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e73%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(89%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e74%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(111%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e75%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(133%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e76%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(155%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e77%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(177%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e78%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(199%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e79%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(221%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e80%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(244%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e81%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(266%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e82%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(288%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e83%2c000%2c000%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(310%2c0)'%3e %3cline stroke='currentColor' y2='6'/%3e %3ctext fill='currentColor' y='9' dy='0.71em'%3e84%2c000%2c000%3c/text%3e %3c/g%3e %3ctext x='310' dy='-5' text-anchor='end' style='font-family: Arial%2c sans-serif%3b font-size: 12px%3b fill: rgb(123%2c 123%2c 123)%3b font-weight: bold%3b'%3e Total_population %3c/text%3e %3c/g%3e %3cg fill='none' font-size='10' font-family='sans-serif' text-anchor='end'%3e %3cpath class='domain' stroke='currentColor' d='M-6%2c150H0V0H-6'/%3e %3cg class='tick' opacity='1' transform='translate(0%2c150)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e%e2%88%9210%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c133)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e%e2%88%928%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c117)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e%e2%88%926%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c100)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e%e2%88%924%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c83)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e%e2%88%922%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c67)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e0%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c50)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e2%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c33)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e4%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c17)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e6%3c/text%3e %3c/g%3e %3cg class='tick' opacity='1' transform='translate(0%2c0)'%3e %3cline stroke='currentColor' x2='-6'/%3e %3ctext fill='currentColor' x='-9' dy='0.32em'%3e8%3c/text%3e %3c/g%3e %3ctext x='4' text-anchor='start' dominant-baseline='hanging' style='font-family: Arial%2c sans-serif%3b font-size: 12px%3b fill: rgb(123%2c 123%2c 123)%3b font-weight: bold%3b'%3e Net_migration_rate %3c/text%3e %3c/g%3e %3c/g%3e %3cg id='viz'%3e %3cpath d='M24%2c140L19%2c117L17%2c103L18%2c93L21%2c84L25%2c76L30%2c72L36%2c67L43%2c62L52%2c59L62%2c55L73%2c53L86%2c51L99%2c50L113%2c49L127%2c48L140%2c47L153%2c47L165%2c47L174%2c48L181%2c49L186%2c50L191%2c52L192%2c54L192%2c57L190%2c60L187%2c64L184%2c67L181%2c68L177%2c69L174%2c68L171%2c66L169%2c62L168%2c58L167%2c51L168%2c44L170%2c34L175%2c27L183%2c21L192%2c18L202%2c16L213%2c16L222%2c18L230%2c21L238%2c26L244%2c33L249%2c41L252%2c48L255%2c54L256%2c58L256%2c60L256%2c62L254%2c62L252%2c61L250%2c59L249%2c56L248%2c52L247%2c48L248%2c45L249%2c42L250%2c39L252%2c37L254%2c34L257%2c32L260%2c29L265%2c26L270%2c23L276%2c23L283%2c27L288%2c30L294%2c33L296%2c35L297%2c51' stroke='grey' stroke-width='1.5' fill='none' marker-mid='url(%23arrow)' marker-end='url(%23arrow)'/%3e %3cg%3e %3ccircle cx='24' cy='140' fill='rgb(56%2c 136%2c 193)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='19' cy='117' fill='rgb(55%2c 134%2c 192)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='17' cy='103' fill='rgb(51%2c 131%2c 190)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='18' cy='93' fill='rgb(47%2c 127%2c 188)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='21' cy='84' fill='rgb(42%2c 122%2c 185)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='25' cy='76' fill='rgb(41%2c 121%2c 184)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='30' cy='72' fill='rgb(33%2c 112%2c 179)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='36' cy='67' fill='rgb(25%2c 102%2c 172)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='43' cy='62' fill='rgb(21%2c 97%2c 168)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='52' cy='59' fill='rgb(12%2c 81%2c 153)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='62' cy='55' fill='rgb(10%2c 75%2c 146)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='73' cy='53' fill='rgb(8%2c 61%2c 126)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='86' cy='51' fill='rgb(8%2c 58%2c 121)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='99' cy='50' fill='rgb(8%2c 48%2c 108)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='113' cy='49' fill='rgb(8%2c 48%2c 107)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='127' cy='48' fill='rgb(8%2c 53%2c 115)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='140' cy='47' fill='rgb(8%2c 53%2c 114)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='153' cy='47' fill='rgb(8%2c 64%2c 130)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='165' cy='47' fill='rgb(14%2c 85%2c 156)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='174' cy='48' fill='rgb(35%2c 114%2c 180)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='181' cy='49' fill='rgb(69%2c 146%2c 198)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='186' cy='50' fill='rgb(94%2c 165%2c 208)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='191' cy='52' fill='rgb(154%2c 199%2c 225)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='192' cy='54' fill='rgb(194%2c 218%2c 238)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='192' cy='57' fill='rgb(204%2c 224%2c 241)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='190' cy='60' fill='rgb(210%2c 227%2c 243)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='187' cy='64' fill='rgb(209%2c 226%2c 243)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='184' cy='67' fill='rgb(208%2c 226%2c 242)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='181' cy='68' fill='rgb(208%2c 226%2c 242)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='177' cy='69' fill='rgb(207%2c 225%2c 242)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='174' cy='68' fill='rgb(200%2c 222%2c 240)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='171' cy='66' fill='rgb(203%2c 223%2c 241)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='169' cy='62' fill='rgb(209%2c 227%2c 243)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='168' cy='58' fill='rgb(218%2c 232%2c 246)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='167' cy='51' fill='rgb(224%2c 236%2c 248)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='168' cy='44' fill='rgb(225%2c 237%2c 248)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='170' cy='34' fill='rgb(221%2c 234%2c 247)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='175' cy='27' fill='rgb(217%2c 231%2c 245)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='183' cy='21' fill='rgb(214%2c 230%2c 244)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='192' cy='18' fill='rgb(217%2c 231%2c 245)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='202' cy='16' fill='rgb(217%2c 232%2c 245)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='213' cy='16' fill='rgb(231%2c 241%2c 250)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='222' cy='18' fill='rgb(238%2c 245%2c 252)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='230' cy='21' fill='rgb(241%2c 247%2c 253)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='238' cy='26' fill='rgb(247%2c 251%2c 255)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='244' cy='33' fill='rgb(247%2c 251%2c 255)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='249' cy='41' fill='rgb(236%2c 244%2c 252)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='252' cy='48' fill='rgb(229%2c 239%2c 249)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='255' cy='54' fill='rgb(230%2c 240%2c 249)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='256' cy='58' fill='rgb(229%2c 239%2c 249)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='256' cy='60' fill='rgb(226%2c 238%2c 248)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='256' cy='62' fill='rgb(231%2c 241%2c 250)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='254' cy='62' fill='rgb(232%2c 241%2c 250)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='252' cy='61' fill='rgb(232%2c 242%2c 250)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='250' cy='59' fill='rgb(230%2c 240%2c 249)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='249' cy='56' fill='rgb(232%2c 242%2c 250)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='248' cy='52' fill='rgb(233%2c 242%2c 251)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='247' cy='48' fill='rgb(228%2c 239%2c 249)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='248' cy='45' fill='rgb(226%2c 238%2c 248)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='249' cy='42' fill='rgb(230%2c 240%2c 249)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='250' cy='39' fill='rgb(224%2c 236%2c 248)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='252' cy='37' fill='rgb(225%2c 237%2c 248)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='254' cy='34' fill='rgb(222%2c 235%2c 247)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='257' cy='32' fill='rgb(220%2c 234%2c 246)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='260' cy='29' fill='rgb(212%2c 228%2c 244)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='265' cy='26' fill='rgb(206%2c 225%2c 242)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='270' cy='23' fill='rgb(190%2c 216%2c 236)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='276' cy='23' fill='rgb(193%2c 218%2c 237)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='283' cy='27' fill='rgb(196%2c 219%2c 238)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='288' cy='30' fill='rgb(200%2c 221%2c 240)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='294' cy='33' fill='rgb(204%2c 224%2c 241)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='296' cy='35' fill='rgb(202%2c 222%2c 240)' r='1' stroke='none'/%3e %3c/g%3e %3cg%3e %3ccircle cx='297' cy='51' fill='rgb(201%2c 222%2c 240)' r='1' stroke='none'/%3e %3c/g%3e %3cg id='labels'%3e %3cg transform='translate(24%2c140)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(19%2c117)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(17%2c103)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(18%2c93)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(21%2c84)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(25%2c76)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(30%2c72)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(36%2c67)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(43%2c62)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(52%2c59)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(62%2c55)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(73%2c53)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(86%2c51)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(99%2c50)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(113%2c49)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(127%2c48)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(140%2c47)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(153%2c47)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(165%2c47)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(174%2c48)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(181%2c49)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(186%2c50)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(191%2c52)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(192%2c54)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(192%2c57)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(190%2c60)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(187%2c64)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(184%2c67)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(181%2c68)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(177%2c69)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(174%2c68)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(171%2c66)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(169%2c62)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(168%2c58)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(167%2c51)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(168%2c44)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(170%2c34)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(175%2c27)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(183%2c21)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(192%2c18)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(202%2c16)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(213%2c16)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(222%2c18)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(230%2c21)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(238%2c26)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(244%2c33)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(249%2c41)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(252%2c48)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(255%2c54)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(256%2c58)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(256%2c60)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(256%2c62)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(254%2c62)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(252%2c61)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(250%2c59)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(249%2c56)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(248%2c52)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(247%2c48)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(248%2c45)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(249%2c42)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(250%2c39)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(252%2c37)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(254%2c34)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(257%2c32)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(260%2c29)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(265%2c26)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(270%2c23)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(276%2c23)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(283%2c27)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(288%2c30)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(294%2c33)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(296%2c35)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3cg transform='translate(297%2c51)'%3e %3ctext x='0' y='0' text-anchor='middle' dominant-baseline='text-before-edge' transform='translate(0%2c0)'%3e %3ctspan x='0' y='0' dy='0'/%3e %3c/text%3e %3c/g%3e %3c/g%3e %3c/g%3e %3c/g%3e %3c/g%3e %3c/g%3e %3cdefs%3e %3cmarker id='arrow' refX='4' refY='4' markerWidth='10' markerHeight='10' orient='auto'%3e %3cpath d='M 0 0 8 4 0 8 2 4' style='fill: black%3b'/%3e %3c/marker%3e %3c/defs%3e %3cclipPath id='serieClipPath'%3e %3crect x='-5' y='-5' width='320' height='160'/%3e %3c/clipPath%3e%3c/svg%3e";

const metadata$2 = {
  name: 'Connected Scatterplot',
  id: 'rawgraphs.connectedscatterplot',
  thumbnail: img$4,
  icon: img$5,
  categories: ['correlations', 'proportions', 'timeseries'],
  description: 'It displays a quantitative dimension over another non-continuous dimension. Another dimension can be used for linking data points over a time series culminating in a connected graph.',
  code: 'TODO',
  tutorial: 'https://rawgraphs.io/learning/how-to-make-a-scatterplot/'
};

const dimensions$2 = [{
  id: 'x',
  name: 'X Axis',
  validTypes: ['number', 'date'],
  required: true
}, {
  id: 'y',
  name: 'Y Axis',
  validTypes: ['number', 'date'],
  required: true
}, {
  id: 'size',
  name: 'Size',
  validTypes: ['number'],
  required: false
}, {
  id: 'color',
  name: 'Color',
  validTypes: ['number', 'date', 'string'],
  required: false
}, {
  id: 'connectedBy',
  name: 'Connection by',
  validTypes: ['number', 'date'],
  required: false
}, {
  id: 'label',
  name: 'Label',
  validTypes: ['number', 'date', 'string'],
  required: false,
  multiple: true
}
// {
//   id: 'series',
//   name: 'Series',
//   validTypes: ['number', 'date', 'string'],
//   required: false,
//   multiple: false,
// },
];

const mapData$2 = {
  x: 'get',
  y: 'get',
  size: 'get',
  color: 'get',
  label: 'get',
  connectedBy: 'get'
  // series: 'get',
};

function render$2(svgNode, data, visualOptions, mapping, originalData, styles) {
  const {
    width,
    height,
    background,
    xOrigin,
    yOrigin,
    showStroke,
    showPoints,
    dotsDiameter,
    drawArrows,
    arrowSize,
    showLegend,
    legendWidth,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    colorScale,
    showLabelsOutline,
    autoHideLabels,
    labelStyles,
    showGrid,
    showSeriesLabels,
    sortSeriesBy,
    useSameYScale,
    useSameXScale,
    title
  } = visualOptions;
  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft
  };

  // if series is exposed, recreate the nested structure
  const nestedData = groups(data, d => d.series);

  // compute max values for series
  // will add it as property to each series.

  nestedData.forEach(function (serie) {
    serie.totalValue = data.filter(item => item.series == serie[0]).reduce((result, item) => result + mapping.size.value ? item.size : 1, 0);
  });

  // series sorting functions
  const seriesSortings = {
    totalDescending: function (a, b) {
      return descending(a.totalValue, b.totalValue);
    },
    totalAscending: function (a, b) {
      return ascending(a.totalValue, b.totalValue);
    },
    name: function (a, b) {
      return ascending(a[0], b[0]);
    }
  };
  // sort series
  nestedData.sort(seriesSortings[sortSeriesBy]);

  // select the SVG element
  const svg = select$1(svgNode);

  // add background
  svg.append('rect').attr('width', showLegend ? width + legendWidth : width).attr('height', height).attr('x', 0).attr('y', 0).attr('fill', background).attr('id', 'background');

  // add the visualization layer
  const seriesLayer = svg.append('g').attr('id', 'series');

  // create the grid manually
  const gridCols = Math.ceil(Math.sqrt(nestedData.length));
  const gridRows = Math.ceil(nestedData.length / gridCols);
  const gridWidth = width / gridCols;
  const gridHeight = height / gridRows;

  // draw the grid if asked
  if (showGrid) {
    svg.append('g').attr('id', 'grid').selectAll('rect').data(nestedData).enter().append('rect').attr('x', (d, i) => i % gridCols * gridWidth).attr('y', (d, i) => Math.floor(i / gridCols) * gridHeight).attr('width', gridWidth).attr('height', gridHeight).attr('fill', 'none').attr('stroke', '#ccc');
  }

  // Add title
  if (title) {
    svg.append('text').attr('x', width / 2).attr('y', margin.top / 2).attr('text-anchor', 'middle').attr('font-size', '16px').attr('font-weight', 'bold').text(title);
  }
  if (drawArrows) {
    svg.append("svg:defs").append("svg:marker").attr("id", "arrow").attr("refX", arrowSize * 2).attr("refY", arrowSize).attr("markerWidth", arrowSize * 2).attr("markerHeight", arrowSize * 2).attr("orient", "auto").append("path").attr("d", `M${arrowSize / 2} ${arrowSize} L0 ${arrowSize * 2} L${arrowSize * 2} ${arrowSize} L0 0 Z`).style("fill", "black");
  }

  // create the clip path
  svg.append('clipPath').attr('id', 'serieClipPath').append('rect').attr('x', -margin.left).attr('y', -margin.top).attr('width', gridWidth).attr('height', gridHeight);

  // create the grid
  const series = seriesLayer.selectAll('g').data(nestedData).join('g').attr('id', d => d[0]).attr('transform', (d, i) => 'translate(' + i % gridCols * gridWidth + ',' + Math.floor(i / gridCols) * gridHeight + ')');

  /*
    YOU CAN PUT HERE CODE THAT APPLIES TO ALL THE SERIES
  */

  // do stuff for each series
  series.each(function (serie, seriesIndex) {
    // make a local selection for each series
    const selection = select$1(this).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // add the clip path
    selection.attr('clip-path', 'url(#serieClipPath)');

    // add series titles
    if (showSeriesLabels) {
      select$1(this).append('text').attr('y', 4).attr('x', 4).text(d => d[0]).attr('class', 'seriesLabel'); //instead of .styles(styles.seriesLabel)
    }

    // compute each series width and height
    const seriesWidth = gridWidth - margin.right - margin.left;
    const seriesHeight = gridHeight - margin.top - margin.bottom;
    // get series data
    const serieData = serie[1];

    // calculate domains
    // y domain
    const yDomain = useSameYScale ?
    // compute extent of the whole dataset
    extent(data, e => e.y) :
    // compute extent of the single series
    extent(serieData, d => d.y);
    if (yOrigin) {
      yDomain[0] = 0;
    }

    // x domain
    const xDomain = useSameXScale ?
    // compute extent of the whole dataset
    extent(data, e => e.x) :
    // compute extent of the single series
    extent(serieData, d => d.x);
    if (xOrigin) {
      xDomain[0] = 0;
    }

    // create scales
    // x scale
    const xScale = mapping.x.dataType.type === 'date' ? scaleTime() : scaleLinear();
    xScale.domain(xDomain).rangeRound([0, seriesWidth]).nice();

    // y scale
    const yScale = mapping.y.dataType.type === 'date' ? scaleTime() : scaleLinear();
    yScale.domain(yDomain).rangeRound([seriesHeight, 0]).nice();

    // create axis functions
    // x axis
    const xAxis = g => {
      return g.attr('transform', `translate(0,${seriesHeight})`).call(axisBottom(xScale)).call(g => g.append('text').attr('x', seriesWidth).attr('dy', -5).attr('text-anchor', 'end').text(mapping['x'].value).attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)
      );
    };

    // y axis
    const yAxis = g => {
      return g.call(axisLeft(yScale)).call(g => g.append('text').attr('x', 4).attr('text-anchor', 'start').attr('dominant-baseline', 'hanging').text(mapping['y'].value).attr('class', 'axisLabel') //instead of .styles(styles.axisLabel)
      );
    };

    // append axes to the svg
    const axisLayer = selection.append('g').attr('id', 'axis');
    axisLayer.append('g').call(xAxis);
    axisLayer.append('g').call(yAxis);

    // create a group for visualization
    const vizLayer = selection.append('g').attr('id', 'viz');

    // add connection line
    if (mapping.connectedBy.value) {
      line().x(d => xScale(d.x)).y(d => yScale(d.y));
      vizLayer.append('path').attr('d', () => line(serieData.sort((a, b) => {
        return ascending(a.connectedBy, b.connectedBy);
      }))).attr('stroke', 'grey').attr('stroke-width', 1.5).attr('fill', 'none').attr('marker-mid', 'url(#arrow)').attr('marker-end', 'url(#arrow)').attr('marker-size', 10);
    }

    // create circles
    const bubbles = vizLayer.selectAll('g').data(serieData).join('g');
    bubbles.append('circle').attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y)).attr('fill', d => {
      return colorScale(d.color);
    }).attr('r', dotsDiameter / 2).attr('stroke', showStroke ? 'white' : 'none');

    // add dots on the center
    if (showPoints) {
      bubbles.append('circle').attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y)).attr('fill', 'black').attr('r', dotsDiameter / 2);
    }

    // create a group for labels
    const labelsLayer = vizLayer.append('g').attr('id', 'labels');

    // add labels
    labelsLayer.selectAll('g').data(mapping.label.value ? serieData : []).join('g').attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`).append('text').attr('x', 0).attr('y', 0).attr('text-anchor', 'middle').attr('dominant-baseline', 'text-before-edge').selectAll('tspan').data(d => Array.isArray(d.label) ? d.label : [d.label]).join('tspan').attr('x', 0).attr('y', 0).attr('dy', (d, i) => i * 12) //@TODO fix magic number
    .text((d, i) => {
      if (d && mapping.label.dataType[i].type === 'date') {
        return timeFormat(dateFormats[mapping.label.dataType[i].dateFormat])(d);
      } else {
        return d;
      }
    }).attr("class", (d, i) => styles[labelStyles[i]]); //instead of .styles((d, i) => styles[labelStyles[i]])

    // center labels position
    labelsLayer.selectAll('text').call(sel => {
      return sel.attr('transform', function (d) {
        const height = sel.node().getBBox().height;
        return `translate(0,${-height / 2})`;
      });
    });

    // add outline
    if (showLabelsOutline) {
      // NOTE: Adobe Illustrator does not support paint-order attr
      labelsLayer.selectAll('text').attr("class", "labelOutline"); //instead of .styles(styles.labelOutline)
    }

    // auto hide labels
    if (autoHideLabels) {
      labelsOcclusion(labelsLayer.selectAll('text'), d => d.size);
    }
    /*
      END OF THE CHART CODE
    */
  });

  // add legend
  if (showLegend) {
    const legendLayer = select$1(svgNode).append('g').attr('id', 'legend').attr('transform', `translate(${width},${marginTop})`);
    const chartLegend = legend().legendWidth(legendWidth);
    if (mapping.color.value) {
      chartLegend.addColor(mapping.color.value, colorScale);
    }
    legendLayer.call(chartLegend);
  }
}

const visualOptions$2 = {
  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 50,
    group: 'artboard'
  },
  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 50,
    group: 'artboard'
  },
  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 50,
    group: 'artboard'
  },
  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 50,
    group: 'artboard'
  },
  showLegend: {
    type: 'boolean',
    label: 'Show legend',
    default: false,
    group: 'artboard'
  },
  legendWidth: {
    type: 'number',
    label: 'Legend width',
    default: 200,
    group: 'artboard',
    disabled: {
      showLegend: false
    },
    container: 'width',
    containerCondition: {
      showLegend: true
    }
  },
  xOrigin: {
    type: 'boolean',
    label: 'Set X origin to 0',
    default: false,
    group: 'chart',
    requiredDimensions: ['x', 'y']
  },
  yOrigin: {
    type: 'boolean',
    label: 'Set Y origin to 0',
    default: false,
    group: 'chart',
    requiredDimensions: ['x', 'y']
  },
  maxDiameter: {
    type: 'number',
    label: 'Max diameter',
    default: 15,
    step: 1,
    group: 'chart',
    requiredDimensions: ['x', 'y']
  },
  showStroke: {
    type: 'boolean',
    label: 'Show stroke',
    default: false,
    group: 'chart',
    requiredDimensions: ['x', 'y']
  },
  showPoints: {
    type: 'boolean',
    label: 'Show dots on data values',
    default: false,
    group: 'chart',
    requiredDimensions: ['x', 'y']
  },
  dotsDiameter: {
    type: 'number',
    label: 'Dots diameter',
    default: 2,
    group: 'chart',
    disabled: {
      showPoints: false
    },
    requiredDimensions: ['x', 'y']
  },
  drawArrows: {
    type: 'boolean',
    label: 'Draw arrows',
    default: true,
    group: 'chart'
  },
  arrowSize: {
    type: 'number',
    label: 'Arrow size',
    default: 4,
    group: 'chart'
  },
  colorScale: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'color',
    default: {
      scaleType: 'ordinal',
      interpolator: 'interpolateSpectral'
    },
    group: 'colors'
  },
  labelStyles: {
    type: 'text',
    label: 'Label',
    group: 'labels',
    options: [{
      label: 'Primary',
      value: 'labelPrimary'
    }, {
      label: 'Secondary',
      value: 'labelSecondary'
    }, {
      label: 'Italic',
      value: 'labelItalic'
    }],
    default: 'labelPrimary',
    repeatFor: 'label',
    repeatDefault: ['labelPrimary', 'labelSecondary', 'labelItalic']
  },
  showLabelsOutline: {
    type: 'boolean',
    label: 'Show outline',
    default: false,
    group: 'labels'
  },
  autoHideLabels: {
    type: 'boolean',
    label: 'Auto hide labels',
    default: false,
    group: 'labels'
  },
  // Title
  title: {
    type: 'text',
    label: 'Chart Title',
    default: 'Connected Scatterplot',
    group: 'chart'
  }
};

var connectedscatterplot = {
  metadata: metadata$2,
  dimensions: dimensions$2,
  mapData: mapData$2,
  render: render$2,
  visualOptions: visualOptions$2,
  styles: styles$1
};

var img$3 = "data:image/svg+xml,%3csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='320' height='160' viewBox='0 0 320 160'%3e %3cdefs%3e %3cstyle%3e .cls-1 %7b fill: none%3b %7d .cls-2 %7b clip-path: url(%23clip-path)%3b %7d .cls-3 %7b fill: white%3b %7d .cls-4 %7b fill: %23ccc%3b %7d .cls-5 %7b fill: %23a0d9a3%3b %7d .cls-6 %7b fill: %234ba0b1%3b %7d .cls-7 %7b fill: %235e4fa2%3b %7d .cls-8 %7b fill: %239e0142%3b %7d .cls-9 %7b fill: %23e1524a%3b %7d .cls-10 %7b fill: %23fba35e%3b %7d .cls-11 %7b fill: %23fee89a%3b %7d .cls-12 %7b fill: %23ebf7a6%3b %7d .cls-13%2c .cls-14%2c .cls-15%2c .cls-16 %7b isolation: isolate%3b font-size: 10px%3b font-family: Helvetica%3b %7d .cls-13 %7b letter-spacing: -0.0547em%3b %7d .cls-15 %7b letter-spacing: -0.0366em%3b %7d .cls-16 %7b letter-spacing: -0.0176em%3b %7d %3c/style%3e %3cclipPath id='clip-path'%3e %3crect class='cls-1' width='320' height='160'/%3e %3c/clipPath%3e %3c/defs%3e %3cg class='cls-2'%3e %3cg%3e %3crect id='backgorund' class='cls-3' x='60' y='-20' width='200' height='200'/%3e %3cg id='viz'%3e %3cg%3e %3cpath class='cls-4' d='M160.1225%2c32a48%2c48%2c0%2c0%2c1%2c45.1469%2c63.9585l-22.1433-7.87A24.5%2c24.5%2c0%2c0%2c0%2c160.1225%2c55.5Z'/%3e %3cpath class='cls-3' d='M160.1225%2c32a48%2c48%2c0%2c0%2c1%2c45.1469%2c63.9585l-22.1433-7.87A24.5%2c24.5%2c0%2c0%2c0%2c160.1225%2c55.5V32m-1-1.0026V56.4953l.995.005a23.5%2c23.5%2c0%2c0%2c1%2c22.0647%2c31.2586l-.3286.9392.9376.3332%2c22.1433%2c7.87.9447.3357.3333-.9455A49%2c49%2c0%2c0%2c0%2c160.1251%2c31l-1.0026-.0026Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-4' d='M205.1874%2c96.19a48%2c48%2c0%2c0%2c1-92.1584-6.3038l23.0087-4.7813A24.5%2c24.5%2c0%2c0%2c0%2c183.0441%2c88.32Z'/%3e %3cpath class='cls-3' d='M136.0377%2c85.1045A24.5%2c24.5%2c0%2c0%2c0%2c183.0441%2c88.32l22.1433%2c7.87a48%2c48%2c0%2c0%2c1-92.1583-6.3038l23.0086-4.7813m.7707-1.1815-.9742.2025-23.0086%2c4.7812-.9816.204.2065.9811a48.9951%2c48.9951%2c0%2c0%2c0%2c94.0783%2c6.4351l.3381-.9438-.9446-.3358-22.1433-7.87-.9376-.3332-.3379.9359a23.3594%2c23.3594%2c0%2c0%2c1-17.2073%2c15.004%2c23.4734%2c23.4734%2c0%2c0%2c1-27.88-18.0881l-.2073-.9732Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-4' d='M112.9792%2c89.6459A48%2c48%2c0%2c0%2c1%2c159.8775%2c32V55.5a24.5%2c24.5%2c0%2c0%2c0-23.89%2c29.3644Z'/%3e %3cpath class='cls-3' d='M159.8775%2c32V55.5a24.5%2c24.5%2c0%2c0%2c0-23.89%2c29.3644l-23.0086%2c4.7812A48%2c48%2c0%2c0%2c1%2c159.8775%2c32m1-1.0026L159.8749%2c31A49%2c49%2c0%2c0%2c0%2c112%2c89.8469l.2014.9821.9817-.204%2c23.0085-4.7812.9742-.2025-.1975-.9752A23.5%2c23.5%2c0%2c0%2c1%2c159.8825%2c56.5l.995-.005V30.9976Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-5' d='M160.1225%2c7.5a72.5013%2c72.5013%2c0%2c0%2c1%2c28.6492%2c5.9534L179.4092%2c35.008A48.9975%2c48.9975%2c0%2c0%2c0%2c160.1225%2c31Z'/%3e %3cpath class='cls-3' d='M160.1225%2c7.5a72.5013%2c72.5013%2c0%2c0%2c1%2c28.6492%2c5.9534L179.4092%2c35.008A48.9975%2c48.9975%2c0%2c0%2c0%2c160.1225%2c31V7.5m-1-1.0017V31.9977L160.12%2c32a47.7325%2c47.7325%2c0%2c0%2c1%2c18.8931%2c3.926l.916.3951.3974-.9149%2c9.3623-21.5545.3992-.9188-.9195-.3975A73.0859%2c73.0859%2c0%2c0%2c0%2c160.1242%2c6.5l-1.0017-.0017Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-6' d='M188.9964%2c13.5511a72.4993%2c72.4993%2c0%2c0%2c1%2c35.3188%2c32.9855L203.45%2c57.3481A49%2c49%2c0%2c0%2c0%2c179.634%2c35.1056Z'/%3e %3cpath class='cls-3' d='M188.9964%2c13.5511a72.4993%2c72.4993%2c0%2c0%2c1%2c35.3188%2c32.9855L203.45%2c57.3481A49%2c49%2c0%2c0%2c0%2c179.634%2c35.1056l9.3624-21.5545m-.5181-1.3172-.3991.9188-9.3625%2c21.5545-.3974.9149.914.4a48.1614%2c48.1614%2c0%2c0%2c1%2c23.33%2c21.7886l.4611.8845.8857-.4589%2c20.8653-10.8115.8894-.4609-.4624-.8886a73.7354%2c73.7354%2c0%2c0%2c0-35.8059-33.44l-.9181-.4006Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-7' d='M224.4279%2c46.7541a72.5%2c72.5%2c0%2c0%2c1%2c3.9269%2c57.4092l-22.1431-7.87a49%2c49%2c0%2c0%2c0-2.6491-38.728Z'/%3e %3cpath class='cls-3' d='M224.428%2c46.7541a72.5%2c72.5%2c0%2c0%2c1%2c3.9269%2c57.4092l-22.1432-7.87a49%2c49%2c0%2c0%2c0-2.6491-38.7279L224.428%2c46.7541m.4293-1.3487-.8894.4608L203.1025%2c56.6778l-.8856.4589.4567.8868a48.19%2c48.19%2c0%2c0%2c1%2c2.595%2c37.9376l-.3317.9407.94.3341%2c22.1432%2c7.87.9439.3354.3338-.9444a73.7776%2c73.7776%2c0%2c0%2c0-3.981-58.2011l-.4594-.89Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-8' d='M228.2728%2c104.3942a72.5%2c72.5%2c0%2c0%2c1-15.2037%2c25.0013l-17.1746-16.04A49.0008%2c49.0008%2c0%2c0%2c0%2c206.13%2c96.5245Z'/%3e %3cpath class='cls-3' d='M206.13%2c96.5245l22.1432%2c7.87a72.5009%2c72.5009%2c0%2c0%2c1-15.2036%2c25.0013l-17.1747-16.04A49.0008%2c49.0008%2c0%2c0%2c0%2c206.13%2c96.5245m-.605-1.2763-.3364.939a47.7326%2c47.7326%2c0%2c0%2c1-10.0263%2c16.4876l-.679.7307.729.6808%2c17.1747%2c16.04.7321.6837.6824-.7333a73.0843%2c73.0843%2c0%2c0%2c0%2c15.4134-25.3462l.3371-.9432-.9439-.3355-22.1432-7.87-.94-.334Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-9' d='M212.9019%2c129.5746a72.5%2c72.5%2c0%2c0%2c1-98.5607%2c6.7417l14.8306-18.2293a49%2c49%2c0%2c0%2c0%2c66.5554-4.5525Z'/%3e %3cpath class='cls-3' d='M195.7272%2c113.5345l17.1747%2c16.04a72.4976%2c72.4976%2c0%2c0%2c1-98.5607%2c6.7417l14.8306-18.2293a48.9982%2c48.9982%2c0%2c0%2c0%2c66.5554-4.5525m-.0464-1.4116-.6827.7273a47.9984%2c47.9984%2c0%2c0%2c1-65.1971%2c4.46l-.7754-.6276-.63.7738-14.8306%2c18.2292-.6322.777.7781.6309a73.4975%2c73.4975%2c0%2c0%2c0%2c99.92-6.8348l.6849-.7309-.732-.6837-17.1747-16.04-.729-.6808Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-10' d='M114.1512%2c136.1617a72.5%2c72.5%2c0%2c0%2c1-25.11-41.2912L112.05%2c90.0893a49%2c49%2c0%2c0%2c0%2c16.9318%2c27.8431Z'/%3e %3cpath class='cls-3' d='M112.05%2c90.0892a49%2c49%2c0%2c0%2c0%2c16.9319%2c27.8432l-14.8306%2c18.2293a72.5%2c72.5%2c0%2c0%2c1-25.11-41.2912L112.05%2c90.0892m.7732-1.182-.9766.203L88.838%2c93.8914l-.9808.2038.2055.98a73.7347%2c73.7347%2c0%2c0%2c0%2c25.4561%2c41.8607l.7759.6335.6322-.777%2c14.83-18.2293.63-.7738-.7723-.6314a48.16%2c48.16%2c0%2c0%2c1-16.5862-27.275l-.2054-.9761Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-11' d='M88.9916%2c94.6306a72.5%2c72.5%2c0%2c0%2c1%2c11.7075-56.34l19.1989%2c13.552A49%2c49%2c0%2c0%2c0%2c112%2c89.8494Z'/%3e %3cpath class='cls-3' d='M100.6991%2c38.2908l19.1988%2c13.552A49.0006%2c49.0006%2c0%2c0%2c0%2c112%2c89.8494L88.9916%2c94.6306a72.5%2c72.5%2c0%2c0%2c1%2c11.7075-56.34m-.2417-1.3946-.5762.8193A73.7772%2c73.7772%2c0%2c0%2c0%2c88.0121%2c94.8324l.2022.9811.9807-.2038%2c23.0086-4.7813.9766-.2029-.2005-.9771a48.1884%2c48.1884%2c0%2c0%2c1%2c7.7367-37.2309l.5732-.8164-.815-.5752L101.2758%2c37.4738l-.8184-.5776Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-12' d='M100.84%2c38.0907A72.5%2c72.5%2c0%2c0%2c1%2c159.8775%2c7.5V31a49%2c49%2c0%2c0%2c0-39.8383%2c20.6425Z'/%3e %3cpath class='cls-3' d='M159.8775%2c7.5V31a49%2c49%2c0%2c0%2c0-39.8383%2c20.6425L100.84%2c38.0907A72.5%2c72.5%2c0%2c0%2c1%2c159.8775%2c7.5m1-1.0017L159.8758%2c6.5a73.625%2c73.625%2c0%2c0%2c0-59.8514%2c31.0125l-.579.8174.8183.5776L119.4626%2c52.46l.8149.5753.5773-.8135A48.0911%2c48.0911%2c0%2c0%2c1%2c159.88%2c32l.9975-.0024V6.4984Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-6' d='M198.7572-8.9206a96.996%2c96.996%2c0%2c0%2c1%2c11.5377%2c5.9783l-12.21%2c20.0789a73.49%2c73.49%2c0%2c0%2c0-8.69-4.5027Z'/%3e %3cpath class='cls-3' d='M198.7572-8.9206a96.996%2c96.996%2c0%2c0%2c1%2c11.5377%2c5.9783l-12.21%2c20.0789a73.4973%2c73.4973%2c0%2c0%2c0-8.69-4.5027l9.3624-21.5545m-.5183-1.3168-.3989.9184-9.3625%2c21.5545-.3977.9156.9151.3993a72.7518%2c72.7518%2c0%2c0%2c1%2c8.5716%2c4.4415l.8539.5173.5187-.853%2c12.21-20.0789.52-.8555-.8562-.5191a98.325%2c98.325%2c0%2c0%2c0-11.6567-6.04l-.9178-.4Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-7' d='M246.1812%2c35.4825a97.0035%2c97.0035%2c0%2c0%2c1%2c8.765%2c24.6623l-23.0085%2c4.7813a73.5008%2c73.5008%2c0%2c0%2c0-6.6219-18.6321Z'/%3e %3cpath class='cls-3' d='M246.1812%2c35.4825a97.0035%2c97.0035%2c0%2c0%2c1%2c8.765%2c24.6623l-23.0085%2c4.7813a73.5044%2c73.5044%2c0%2c0%2c0-6.6218-18.6321l20.8653-10.8115m.4289-1.3485-.889.4606L224.8558%2c45.4062l-.8864.4592.4578.8872a72.5065%2c72.5065%2c0%2c0%2c1%2c6.5317%2c18.3786l.2048.9771.9774-.2032L255.15%2c61.1239l.98-.2037-.2049-.98A98.0087%2c98.0087%2c0%2c0%2c0%2c247.07%2c35.0236l-.46-.89Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-7' d='M254.996%2c60.3847a97.003%2c97.003%2c0%2c0%2c1%2c1.7694%2c12.8736L233.32%2c74.862a73.493%2c73.493%2c0%2c0%2c0-1.3327-9.6961Z'/%3e %3cpath class='cls-3' d='M254.996%2c60.3847a96.9865%2c96.9865%2c0%2c0%2c1%2c1.7694%2c12.8736L233.32%2c74.862a73.493%2c73.493%2c0%2c0%2c0-1.3327-9.6961l23.0085-4.7812m.7768-1.1828-.98.2037L231.784%2c64.1869l-.9774.2031.2015.9778a72.7592%2c72.7592%2c0%2c0%2c1%2c1.3145%2c9.5641l.07.9959.9959-.0682%2c23.4453-1.6036.9989-.0684-.07-.9988a98.321%2c98.321%2c0%2c0%2c0-1.7877-13.0063l-.2025-.9806Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-8' d='M251.3582%2c112.5987a97.0007%2c97.0007%2c0%2c0%2c1-5.177%2c11.9188L225.3158%2c113.706a73.4984%2c73.4984%2c0%2c0%2c0%2c3.8993-8.977Z'/%3e %3cpath class='cls-3' d='M229.2151%2c104.729l22.1431%2c7.87a97.0007%2c97.0007%2c0%2c0%2c1-5.177%2c11.9188L225.3159%2c113.706a73.5133%2c73.5133%2c0%2c0%2c0%2c3.8992-8.977m-.6058-1.2765-.3359.94a72.78%2c72.78%2c0%2c0%2c1-3.8462%2c8.8548l-.4578.8872.8864.4592%2c20.8653%2c10.8116.889.4606.46-.89a98.3358%2c98.3358%2c0%2c0%2c0%2c5.23-12.0416l.3365-.943-.9434-.3353-22.1431-7.87-.9407-.3343Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-9' d='M230.8074%2c146.2971a97%2c97%2c0%2c0%2c1-32.05%2c22.6235l-9.3624-21.5545a73.4991%2c73.4991%2c0%2c0%2c0%2c24.238-17.109Z'/%3e %3cpath class='cls-3' d='M213.6328%2c130.2571l17.1746%2c16.04a97%2c97%2c0%2c0%2c1-32.05%2c22.6235l-9.3624-21.5545a73.4991%2c73.4991%2c0%2c0%2c0%2c24.238-17.109m-.0471-1.4122-.6826.7284A72.0921%2c72.0921%2c0%2c0%2c1%2c188.9949%2c146.45l-.9151.3993.3977.9156L197.84%2c169.319l.3989.9184.9178-.4a97.4441%2c97.4441%2c0%2c0%2c0%2c32.3807-22.8567l.6843-.7309-.7317-.6834-17.1747-16.04-.73-.6814Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-10' d='M98.69%2c155.1666A97%2c97%2c0%2c0%2c1%2c80.8246%2c136.038l19.1988-13.552A73.4985%2c73.4985%2c0%2c0%2c0%2c113.52%2c136.9374Z'/%3e %3cpath class='cls-3' d='M100.0234%2c122.486A73.4985%2c73.4985%2c0%2c0%2c0%2c113.52%2c136.9374L98.69%2c155.1666A97.0033%2c97.0033%2c0%2c0%2c1%2c80.8246%2c136.038l19.1988-13.552m.239-1.3927-.8156.5758L80.248%2c135.2211l-.818.5774.5784.8172a98.0078%2c98.0078%2c0%2c0%2c0%2c18.049%2c19.3258l.7759.6329.6319-.7767%2c14.8306-18.2292.63-.7744-.7733-.6314a72.508%2c72.508%2c0%2c0%2c1-13.3131-14.2547l-.577-.8147Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-11' d='M65.004%2c99.6153a97%2c97%2c0%2c0%2c1%2c0-39.2306l23.0085%2c4.7812a73.499%2c73.499%2c0%2c0%2c0%2c0%2c29.6682Z'/%3e %3cpath class='cls-3' d='M65.004%2c60.3847l23.0085%2c4.7812a73.499%2c73.499%2c0%2c0%2c0%2c0%2c29.6682L65.004%2c99.6153a97%2c97%2c0%2c0%2c1%2c0-39.2306m-.7768-1.1828-.2025.9806a97.443%2c97.443%2c0%2c0%2c0%2c0%2c39.635l.2025.9806.98-.2037%2c23.0084-4.7813.9775-.2031-.2015-.9778a72.0924%2c72.0924%2c0%2c0%2c1%2c0-29.2644l.2015-.9778-.9775-.2031L65.2075%2c59.4056l-.98-.2037Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-12' d='M121.4675-9.0182A97.0157%2c97.0157%2c0%2c0%2c1%2c133.7118-13.37l6.34%2c22.6286a73.5011%2c73.5011%2c0%2c0%2c0-9.2221%2c3.2776Z'/%3e %3cpath class='cls-3' d='M133.7118-13.37l6.34%2c22.6286a73.5011%2c73.5011%2c0%2c0%2c0-9.2221%2c3.2776L121.4675-9.0182A97.0157%2c97.0157%2c0%2c0%2c1%2c133.7118-13.37m.6928-1.2339-.9638.2714a98.3347%2c98.3347%2c0%2c0%2c0-12.37%2c4.3965l-.9189.3977.3988.9184%2c9.3625%2c21.5545.3977.9157.9163-.3963a72.7684%2c72.7684%2c0%2c0%2c1%2c9.0967-3.2329l.9608-.271-.2692-.9613-6.34-22.6286-.27-.9641Z'/%3e %3c/g%3e %3cg%3e %3cpath class='cls-12' d='M133.9477-13.436A96.9973%2c96.9973%2c0%2c0%2c1%2c159.8775-17V6.5a73.4985%2c73.4985%2c0%2c0%2c0-19.59%2c2.6925Z'/%3e %3cpath class='cls-3' d='M159.8775-17V6.5a73.4985%2c73.4985%2c0%2c0%2c0-19.59%2c2.6925l-6.34-22.6285A96.9933%2c96.9933%2c0%2c0%2c1%2c159.8775-17m1-1.0013L159.8762-18a98.0075%2c98.0075%2c0%2c0%2c0-26.1971%2c3.6007l-.9644.2689.27.9642%2c6.34%2c22.6285.2694.9613.9617-.2677A72.51%2c72.51%2c0%2c0%2c1%2c159.8792%2c7.5l.9983-.0017v-25.5Z'/%3e %3c/g%3e %3c/g%3e %3cg%3e %3ctext class='cls-13' transform='translate(189.315 63.5932) rotate(-35.2174)'%3eA%3c/text%3e %3ctext class='cls-14' transform='translate(160.7473 120.2018) rotate(-86.0871)'%3eB%3c/text%3e %3ctext class='cls-14' transform='translate(126.4549 57.2496) rotate(39.1306)'%3eC%3c/text%3e %3ctext class='cls-14' transform='translate(175.6043 22.1702) rotate(-78.2606)'%3eI%3c/text%3e %3ctext class='cls-15' transform='matrix(0.6826%2c -0.7308%2c 0.7308%2c 0.6826%2c 202.474%2c 39.5994)'%3eL%3c/text%3e %3ctext class='cls-14' transform='translate(217.1808 79.626) rotate(-3.9129)'%3eM%3c/text%3e %3ctext class='cls-14' transform='translate(207.4671 112.9127) rotate(31.3041)'%3eD%3c/text%3e %3ctext class='cls-14' transform='translate(160.4322 138.009) rotate(86.0871)'%3eE%3c/text%3e %3ctext class='cls-14' transform='translate(106.8484 116.44) rotate(-31.3041)'%3eF%3c/text%3e %3ctext class='cls-14' transform='translate(95.4458 70.1712) rotate(11.7394)'%3eG%3c/text%3e %3ctext class='cls-14' transform='matrix(0.4601%2c 0.8879%2c -0.8879%2c 0.4601%2c 127.0505%2c 24.1006)'%3eH%3c/text%3e %3ctext class='cls-14' transform='matrix(0.4601%2c -0.8879%2c 0.8879%2c 0.4601%2c 201.233%2c 8.1878)'%3eF%3c/text%3e %3ctext class='cls-14' transform='translate(238.5645 55.78) rotate(-19.5653)'%3eU%3c/text%3e %3ctext class='cls-14' transform='translate(242.1843 72.2519) rotate(-7.8262)'%3eV%3c/text%3e %3ctext class='cls-14' transform='translate(233.9428 115.915) rotate(23.4782)'%3eN%3c/text%3e %3ctext class='cls-14' transform='translate(204.3448 148.8938) rotate(54.7826)'%3eO%3c/text%3e %3ctext class='cls-16' transform='matrix(0.7308%2c -0.6826%2c 0.6826%2c 0.7308%2c 97.289%2c 143.4203)'%3eP%3c/text%3e %3ctext class='cls-14' transform='translate(70.3608 83.5)'%3eQ%3c/text%3e %3ctext class='cls-14' transform='translate(126.7882 -3.0332) rotate(70.4347)'%3eR%3c/text%3e %3c/g%3e %3c/g%3e %3c/g%3e%3c/svg%3e";

var img$2 = "data:image/svg+xml,%3csvg id='rawgraphs-icons' xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3e %3cdefs%3e %3cstyle%3e .cls-1 %7b fill: %23df88ff%3b %7d .cls-2 %7b fill: %23ad00ff%3b %7d %3c/style%3e %3c/defs%3e %3cg id='secondary'%3e %3cpath class='cls-1' d='M21.3809%2c16.8352l-3.3315-6.1467A20.0207%2c20.0207%2c0%2c0%2c0%2c9.2866%2c20.9942L15.96%2c23.1183A13.0486%2c13.0486%2c0%2c0%2c1%2c21.3809%2c16.8352Z'/%3e %3cpath class='cls-1' d='M27%2c15.0507v-7a19.8756%2c19.8756%2c0%2c0%2c0-8.0724%2c2.16l3.3317%2c6.1473A12.9065%2c12.9065%2c0%2c0%2c1%2c27%2c15.0507Z'/%3e %3cpath class='cls-1' d='M36.288%2c9.8245l-2.7429%2c6.4376A13.07%2c13.07%2c0%2c0%2c1%2c39.0645%2c21.2l6.0944-3.4295A20.0446%2c20.0446%2c0%2c0%2c0%2c36.288%2c9.8245Z'/%3e %3cpath class='cls-1' d='M29%2c8.0505v7a12.93%2c12.93%2c0%2c0%2c1%2c3.6276.8141l2.7346-6.4183A19.9179%2c19.9179%2c0%2c0%2c0%2c29%2c8.0505Z'/%3e %3cpath class='cls-1' d='M45.6652%2c18.6337l-6.102%2c3.4337a12.9061%2c12.9061%2c0%2c0%2c1%2c.102%2c11.634l6.052%2c3.56a19.941%2c19.941%2c0%2c0%2c0-.052-18.6275Z'/%3e %3cpath class='cls-1' d='M33.049%2c39.9792A12.915%2c12.915%2c0%2c0%2c1%2c30.87%2c40.67l1.2833%2c6.8863a20.1278%2c20.1278%2c0%2c0%2c0%2c4.1029-1.3548Z'/%3e %3cpath class='cls-1' d='M28%2c41a12.9119%2c12.9119%2c0%2c0%2c1-4.6613-.8786L20.5742%2c46.56a19.8067%2c19.8067%2c0%2c0%2c0%2c10.5965%2c1.1831l-1.2851-6.8956A12.9706%2c12.9706%2c0%2c0%2c1%2c28%2c41Z'/%3e %3cpath class='cls-1' d='M15%2c28a12.9514%2c12.9514%2c0%2c0%2c1%2c.3568-2.9746L8.6812%2c22.9005A19.8792%2c19.8792%2c0%2c0%2c0%2c19.6576%2c46.16l2.7634-6.4355A13.0035%2c13.0035%2c0%2c0%2c1%2c15%2c28Z'/%3e %3cpath class='cls-1' d='M34.8188%2c39.0472l3.2137%2c6.2356a20.08%2c20.08%2c0%2c0%2c0%2c6.6712-6.2971l-6.0495-3.5583A13.0845%2c13.0845%2c0%2c0%2c1%2c34.8188%2c39.0472Z'/%3e %3c/g%3e %3cg id='primary'%3e %3cpath class='cls-2' d='M27%2c22.5956V16.0507a12.0185%2c12.0185%2c0%2c0%2c0-10.0878%2c7.3709l6.24%2c1.9861A5.513%2c5.513%2c0%2c0%2c1%2c27%2c22.5956Z'/%3e %3cpath class='cls-2' d='M33.5%2c28a5.46%2c5.46%2c0%2c0%2c1-.3369%2c1.8768l5.6382%2c3.3164A11.9619%2c11.9619%2c0%2c0%2c0%2c29%2c16.0507v6.5449A5.5059%2c5.5059%2c0%2c0%2c1%2c33.5%2c28Z'/%3e %3cpath class='cls-2' d='M22.5%2c28a5.5033%2c5.5033%2c0%2c0%2c1%2c.0475-.6858L16.31%2c25.3289A11.9871%2c11.9871%2c0%2c0%2c0%2c32.5878%2c39.0844l-3-5.82A5.4953%2c5.4953%2c0%2c0%2c1%2c22.5%2c28Z'/%3e %3cpath class='cls-2' d='M31.3632%2c32.3423%2c34.36%2c38.1572a12.0783%2c12.0783%2c0%2c0%2c0%2c3.428-3.2393L32.1481%2c31.6A5.5383%2c5.5383%2c0%2c0%2c1%2c31.3632%2c32.3423Z'/%3e %3c/g%3e%3c/svg%3e";

const metadata$1 = {
  name: 'Polar Area Diagram',
  id: 'rawgraphs.polarareadiagram',
  thumbnail: img$3,
  icon: img$2,
  categories: ['hierarchies', 'proportions'],
  description: 'TODO',
  code: 'TODO',
  tutorial: 'TODO'
};

const dimensions$1 = [{
  id: 'hierarchy',
  name: 'Hierarchy',
  validTypes: ['number', 'date', 'string'],
  required: true,
  multiple: true
}, {
  id: 'size',
  name: 'Size',
  validTypes: ['number'],
  required: false,
  aggregation: true,
  aggregationDefault: 'sum'
}, {
  id: 'color',
  name: 'Color',
  validTypes: ['number', 'date', 'string'],
  required: false,
  aggregation: true,
  aggregationDefault: {
    number: 'sum',
    string: 'csvDistinct',
    date: 'csvDistinct'
  }
}, {
  id: 'label',
  name: 'Leaf label',
  validTypes: ['number', 'date', 'string'],
  required: false,
  multiple: true,
  aggregation: true,
  aggregationDefault: {
    number: 'sum',
    string: 'csvDistinct',
    date: 'csvDistinct'
  }
}];

const mapData$1 = function (data, mapping, dataTypes, dimensions) {
  const colorAggregator = getDimensionAggregator('color', mapping, dataTypes, dimensions);
  const sizeAggregator = getDimensionAggregator('size', mapping, dataTypes, dimensions);
  const labelAggregators = getDimensionAggregator('label', mapping, dataTypes, dimensions);

  // add the non-compulsory dimensions.
  'color' in mapping ? null : mapping.color = {
    value: undefined
  };
  'size' in mapping ? null : mapping.size = {
    value: undefined
  };
  'label' in mapping ? null : mapping.label = {
    value: undefined
  };
  const results = [];
  rollups(data, v => {
    const item = {
      hierarchy: new Map(mapping.hierarchy.value.map(d => [d, v[0][d]])),
      // get the first one since it's grouped
      size: mapping.size.value ? sizeAggregator(v.map(d => d[mapping.size.value])) : v.length,
      color: mapping.color.value ? colorAggregator(v.map(d => d[mapping.color.value])) : 'cells color',
      label: mapping.label.value ? mapping.label.value.map((label, i) => {
        return labelAggregators[i](v.map(d => d[label]));
      }) : undefined // create array of strings
    };
    results.push(item);
    return item;
  }, ...mapping.hierarchy.value.map(level => d => d[level]) // create a grouping for each level of the hierarchy
  );
  return results;
};

function render$1(svgNode, data, visualOptions, mapping, originalData, styles) {
  const {
    // artboard
    width,
    height,
    background,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    title,
    // legend
    showLegend,
    legendWidth,
    // chart
    padding,
    rotation,
    // labels
    label1Style,
    label2Style,
    label3Style,
    // colors
    colorScale,
    // labels
    showHierarchyLabels,
    labelHierarchyStyle,
    labelStyles,
    showLabelsOutline,
    autoHideLabels
  } = visualOptions;
  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft
  };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const radius = Math.min(chartWidth, chartHeight) / 2;
  const svg = select$1(svgNode).attr('width', showLegend ? width + legendWidth : width).attr('height', height);

  // Add background
  select$1(svgNode).append('rect').attr('width', showLegend ? width + legendWidth : width).attr('height', height).attr('x', 0).attr('y', 0).attr('fill', background).attr('id', 'background');
  const chartGroup = svg.append('g').attr('transform', `translate(${margin.left + chartWidth / 2},${margin.top + chartHeight / 2})`).attr('id', 'viz');

  // Create the pie layout
  pie().startAngle(rotation).endAngle(Math.PI * 2 + rotation).value(1).sort(null);

  // Map data for pie chart
  const pieData = pie(data);
  const max_rad = max(data, d => d.size) / data.length;
  console.log(pieData);
  console.log(max_rad);

  // Create the arc
  const arc$1 = arc().innerRadius(0).outerRadius(d => radius * (d.data.size / max(data, d => d.size)) + padding * 5);
  console.log(arc$1);

  // Draw the arcs
  chartGroup.selectAll('path').data(pieData).enter().append('path').attr('d', arc$1).attr('fill', d => colorScale(d.data.color)).attr('stroke', 'white').style('stroke-width', padding).on('mouseover', function (event, d) {
    select$1(this).attr('opacity', 0.7);
    select$1(`#label-${d.index}`).style('display', 'block');
  }).on('mouseout', function (event, d) {
    select$1(this).attr('opacity', 1);
    select$1(`#label-${d.index}`).style('display', 'none');
  });

  // Create the arc for label placement
  const labelArc = arc().innerRadius(d => radius * (d.data.size / max(data, d => d.size)) + 10) // Adjust 10 to control distance from the arc
  .outerRadius(d => radius * (d.data.size / max(data, d => d.size)) + 10);

  // Add hidden labels initially
  const textGroups = chartGroup.selectAll('text').data(pieData).enter().append('text').attr('id', d => `label-${d.index}`).attr('transform', function (d) {
    const [x, y] = labelArc.centroid(d);
    return `translate(${x}, ${y})`;
  }).attr('dy', '.35em').attr('text-anchor', 'middle').text(d => d.data.hierarchy.get('month')) // Adjust based on the actual hierarchy level needed
  .style('display', 'none');

  // Add title
  if (title) {
    svg.append('text').attr('x', width / 2).attr('y', margin.top).attr('text-anchor', 'middle').attr('font-size', '16px').attr('font-weight', 'bold').text(title).attr('dy', '1em'); // Adjust this value to move the title down
  }
  if (showLabelsOutline) {
    textGroups.attr('class', 'labelOutline'); //instead of .styles(styles.labelOutline)
  }
  if (autoHideLabels) {
    labelsOcclusion(textGroups, d => d.size);
  }
  if (showLegend) {
    const legendLayer = select$1(svgNode).append('g').attr('id', 'legend').attr('transform', `translate(${width - legendWidth},${marginTop})`);
    const chartLegend = legend().legendWidth(legendWidth);
    if (mapping.color.value) {
      chartLegend.addColor(mapping.color.value, colorScale);
    }
    legendLayer.call(chartLegend);
  }
}

const visualOptions$1 = {
  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 10,
    group: 'artboard'
  },
  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 10,
    group: 'artboard'
  },
  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 10,
    group: 'artboard'
  },
  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 10,
    group: 'artboard'
  },
  // Title
  title: {
    type: 'text',
    label: 'Chart Title',
    default: 'Polar Area Diagram',
    group: 'chart'
  },
  showLegend: {
    type: 'boolean',
    label: 'Show legend',
    default: false,
    group: 'artboard'
  },
  legendWidth: {
    type: 'number',
    label: 'Legend width',
    default: 200,
    group: 'artboard',
    disabled: {
      showLegend: false
    },
    container: 'width',
    containerCondition: {
      showLegend: true
    }
  },
  padding: {
    type: 'number',
    label: 'Padding',
    default: 1,
    group: 'chart'
  },
  rotation: {
    type: 'number',
    label: 'Rotation',
    default: 0,
    group: 'chart'
  },
  colorScale: {
    type: 'colorScale',
    label: 'Color scale',
    dimension: 'color',
    default: {
      scaleType: 'ordinal',
      interpolator: 'interpolateSpectral'
    },
    group: 'colors'
  },
  showHierarchyLabels: {
    type: 'boolean',
    label: 'Show hierarchy labels',
    default: true,
    group: 'labels'
  },
  labelHierarchyStyle: {
    type: 'text',
    label: 'Hierarchy labels',
    group: 'labels',
    options: [{
      label: 'Primary',
      value: 'labelPrimary'
    }, {
      label: 'Secondary',
      value: 'labelSecondary'
    }, {
      label: 'Italic',
      value: 'labelItalic'
    }],
    default: 'labelItalic',
    disabled: {
      showHierarchyLabels: false
    }
  },
  labelStyles: {
    type: 'text',
    label: 'Label',
    group: 'labels',
    options: [{
      label: 'Primary',
      value: 'labelPrimary'
    }, {
      label: 'Secondary',
      value: 'labelSecondary'
    }, {
      label: 'Italic',
      value: 'labelItalic'
    }],
    default: 'labelPrimary',
    repeatFor: 'label',
    repeatDefault: ['labelPrimary', 'labelSecondary', 'labelItalic']
  },
  showLabelsOutline: {
    type: 'boolean',
    label: 'Show outline',
    default: false,
    group: 'labels'
  },
  autoHideLabels: {
    type: 'boolean',
    label: 'Auto hide labels',
    default: false,
    group: 'labels'
  }
};

var polarareadiagram = {
  metadata: metadata$1,
  dimensions: dimensions$1,
  mapData: mapData$1,
  render: render$1,
  visualOptions: visualOptions$1,
  styles: styles$1
};

var img$1 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8'%3f%3e%3csvg id='rawgraphs-icons' xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3e %3crect x='27.0029' y='7.1357' width='.9941' height='38.8643' style='fill: %23ad00ff%3b'/%3e %3cpolygon points='25.815 9.115 27.5 7.43 29.185 9.115 29.185 7.685 27.5 6 25.815 7.685 25.815 9.115' style='fill: %23ad00ff%3b'/%3e %3crect x='8.5' y='47.0029' width='38.8643' height='.9941' style='fill: %23ad00ff%3b'/%3e %3cpolygon points='45.385 45.815 47.07 47.5 45.385 49.185 46.815 49.185 48.5 47.5 46.815 45.815 45.385 45.815' style='fill: %23ad00ff%3b'/%3e %3cpolygon points='10.615 49.185 8.93 47.5 10.615 45.815 9.185 45.815 7.5 47.5 9.185 49.185 10.615 49.185' style='fill: %23ad00ff%3b'/%3e %3crect x='29' y='12' width='12' height='7' style='fill: %23ad00ff%3b'/%3e %3crect x='29' y='20' width='10' height='7' style='fill: %23ad00ff%3b'/%3e %3crect x='29' y='28' width='12' height='7' style='fill: %23ad00ff%3b'/%3e %3crect x='29' y='36' width='8' height='7' style='fill: %23ad00ff%3b'/%3e %3crect x='21' y='12' width='5' height='7' style='fill: %23df88ff%3b'/%3e %3crect x='18' y='20' width='8' height='7' style='fill: %23df88ff%3b'/%3e %3crect x='11' y='28' width='15' height='7' style='fill: %23df88ff%3b'/%3e %3crect x='23' y='36' width='3' height='7' style='fill: %23df88ff%3b'/%3e%3c/svg%3e";

var img = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='805' height='600'%3e%3crect width='805' height='600' fill='white'/%3e%3ctext x='402.5' y='50' style='text-anchor: middle%3b' font-size='20'/%3e%3cg transform='translate(%26%23xA%3b 50%2c%26%23xA%3b 70)'%3e%3cg fill='none' font-size='10' font-family='sans-serif' text-anchor='left' transform='translate(352.5%2c 0)'%3e%3cg class='tick' opacity='1' transform='translate(0%2c11.903771903771906)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e100 100%2b%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c34.71339471339471)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e95-99%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c57.52301752301752)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e90-94%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c80.33264033264034)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e85-89%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c103.14226314226315)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e80-84%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c125.95188595188596)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e75-79%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c148.76150876150876)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e70-74%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c171.5711315711316)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e65-69%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c194.38075438075438)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e60-64%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c217.19037719037718)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e55-59%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c240)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e50-54%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c262.8096228096228)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e45-49%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c285.6192456192456)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e40-44%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c308.42886842886844)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e35-39%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c331.2384912384913)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e30-34%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c354.04811404811403)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e25-29%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c376.8577368577369)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e20-24%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c399.6673596673596)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e15-19%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c422.47698247698247)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e10-14%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c445.2866052866053)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e5-9%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(0%2c468.09622809622806)'%3e%3ctext fill='currentColor' x='0' dy='0.32em' dx='0' text-anchor='middle'%3e0-4%3c/text%3e%3c/g%3e%3ctext font-family='sans-serif' font-size='10' class='labels' fill='currentColor' transform='translate(-9.666666984558105%2c 0)'%3eAge%3c/text%3e%3c/g%3e%3cg fill='none' font-size='10' font-family='sans-serif' text-anchor='middle' transform='translate(-402.5%2c 480)'%3e%3cpath class='domain' stroke='currentColor' d='M705%2c6V0H402.5V6'/%3e%3cg class='tick' opacity='1' transform='translate(705%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e0%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(667.1875%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e50%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(629.375%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e100%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(591.5625%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e150%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(553.75%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e200%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(515.9375%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e250%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(478.125%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e300%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(440.3125%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e350%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(402.5%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e400%2c000%3c/text%3e%3c/g%3e%3ctext font-family='sans-serif' font-size='10' class='labels' fill='currentColor' dx='389.1710510253906' transform='translate(10.558333396911621%2c -5)'%3eMen%3c/text%3e%3c/g%3e%3cg fill='none' font-size='10' font-family='sans-serif' text-anchor='middle' transform='translate(402.5%2c 480)'%3e%3cpath class='domain' stroke='currentColor' d='M0%2c6V0H302.5V6'/%3e%3cg class='tick' opacity='1' transform='translate(0%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e0%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(37.8125%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e50%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(75.625%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e100%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(113.4375%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e150%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(151.25%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e200%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(189.0625%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e250%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(226.875%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e300%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(264.6875%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e350%2c000%3c/text%3e%3c/g%3e%3cg class='tick' opacity='1' transform='translate(302.5%2c0)'%3e%3cline stroke='currentColor' y2='6'/%3e%3ctext fill='currentColor' y='9' dy='0.71em' text-anchor='start' transform='rotate(45)'%3e400%2c000%3c/text%3e%3c/g%3e%3ctext font-family='sans-serif' font-size='10' class='labels' fill='currentColor' dx='327.50801277160645' transform='translate(-18.816667556762695%2c -5)'%3eWomen%3c/text%3e%3c/g%3e%3cg id='bars1'%3e%3crect x='132.51239375' y='457.19037719037715' height='21.811701811701813' width='169.98760625' fill='rgb(234%2c 60%2c 46)'/%3e%3crect x='137.0098125' y='434.3807543807544' height='21.811701811701813' width='165.4901875' fill='rgb(237%2c 65%2c 49)'/%3e%3crect x='138.68415' y='411.57113157113156' height='21.811701811701813' width='163.81585' fill='rgb(238%2c 67%2c 50)'/%3e%3crect x='132.116875' y='388.7615087615087' height='21.811701811701813' width='170.383125' fill='rgb(234%2c 59%2c 46)'/%3e%3crect x='100.86257499999999' y='365.95188595188597' height='21.811701811701813' width='201.637425' fill='rgb(204%2c 29%2c 31)'/%3e%3crect x='69.90548125000001' y='343.1422631422631' height='21.811701811701813' width='232.59451875' fill='rgb(167%2c 15%2c 22)'/%3e%3crect x='69.366275' y='320.3326403326404' height='21.811701811701813' width='233.133725' fill='rgb(166%2c 15%2c 22)'/%3e%3crect x='70.74038125000001' y='297.52301752301753' height='21.811701811701813' width='231.75961875' fill='rgb(168%2c 16%2c 22)'/%3e%3crect x='88.37461875' y='274.7133947133947' height='21.811701811701813' width='214.12538125' fill='rgb(190%2c 22%2c 27)'/%3e%3crect x='68.30676875' y='251.9037719037719' height='21.811701811701813' width='234.19323125' fill='rgb(165%2c 15%2c 22)'/%3e%3crect x='32.10659375' y='229.0941490941491' height='21.811701811701813' width='270.39340625' fill='rgb(103%2c 0%2c 13)'/%3e%3crect x='44.56581249999999' y='206.28452628452627' height='21.811701811701813' width='257.9341875' fill='rgb(126%2c 5%2c 16)'/%3e%3crect x='95.16196249999999' y='183.47490347490347' height='21.811701811701813' width='207.3380375' fill='rgb(198%2c 26%2c 29)'/%3e%3crect x='141.80973124999997' y='160.66528066528068' height='21.811701811701813' width='160.69026875000003' fill='rgb(240%2c 71%2c 53)'/%3e%3crect x='166.64725' y='137.85565785565785' height='21.811701811701813' width='135.85275' fill='rgb(249%2c 104%2c 75)'/%3e%3crect x='175.8266125' y='115.04603504603504' height='21.811701811701813' width='126.67338749999999' fill='rgb(250%2c 116%2c 85)'/%3e%3crect x='226.53846875' y='92.23641223641224' height='21.811701811701813' width='75.96153125000001' fill='rgb(252%2c 177%2c 150)'/%3e%3crect x='263.43590625' y='69.42678942678943' height='21.811701811701813' width='39.06409375' fill='rgb(254%2c 217%2c 201)'/%3e%3crect x='287.93689375' y='46.61716661716662' height='21.811701811701813' width='14.563106249999999' fill='rgb(255%2c 236%2c 227)'/%3e%3crect x='300.00815625' y='23.80754380754381' height='21.811701811701813' width='2.49184375' fill='rgb(255%2c 244%2c 238)'/%3e%3crect x='302.37975625' y='0.9979209979209998' height='21.811701811701813' width='0.12024375000000001' fill='rgb(255%2c 245%2c 240)'/%3e%3c/g%3e%3cg id='bars2'%3e%3crect x='402.5' y='457.19037719037715' height='21.811701811701813' width='160.73110625' fill='rgb(75%2c 152%2c 201)'/%3e%3crect x='402.5' y='434.3807543807544' height='21.811701811701813' width='155.566675' fill='rgb(82%2c 156%2c 204)'/%3e%3crect x='402.5' y='411.57113157113156' height='21.811701811701813' width='155.73758750000002' fill='rgb(81%2c 156%2c 204)'/%3e%3crect x='402.5' y='388.7615087615087' height='21.811701811701813' width='160.22971249999998' fill='rgb(76%2c 152%2c 202)'/%3e%3crect x='402.5' y='365.95188595188597' height='21.811701811701813' width='190.7686' fill='rgb(44%2c 123%2c 186)'/%3e%3crect x='402.5' y='343.1422631422631' height='21.811701811701813' width='221.3074875' fill='rgb(19%2c 94%2c 165)'/%3e%3crect x='402.5' y='320.3326403326404' height='21.811701811701813' width='225.50165' fill='rgb(17%2c 90%2c 161)'/%3e%3crect x='402.5' y='297.52301752301753' height='21.811701811701813' width='228.33683125000002' fill='rgb(15%2c 87%2c 159)'/%3e%3crect x='402.5' y='274.7133947133947' height='21.811701811701813' width='212.97588125' fill='rgb(25%2c 102%2c 172)'/%3e%3crect x='402.5' y='251.9037719037719' height='21.811701811701813' width='238.4047875' fill='rgb(11%2c 77%2c 148)'/%3e%3crect x='402.5' y='229.0941490941491' height='21.811701811701813' width='268.25624375' fill='rgb(8%2c 48%2c 107)'/%3e%3crect x='402.5' y='206.28452628452627' height='21.811701811701813' width='258.93319375' fill='rgb(8%2c 57%2c 121)'/%3e%3crect x='402.5' y='183.47490347490347' height='21.811701811701813' width='217.83403125' fill='rgb(21%2c 97%2c 168)'/%3e%3crect x='402.5' y='160.66528066528068' height='21.811701811701813' width='178.94463125000001' fill='rgb(56%2c 135%2c 192)'/%3e%3crect x='402.5' y='137.85565785565785' height='21.811701811701813' width='159.922675' fill='rgb(76%2c 152%2c 202)'/%3e%3crect x='402.5' y='115.04603504603504' height='21.811701811701813' width='161.82842499999998' fill='rgb(74%2c 151%2c 201)'/%3e%3crect x='402.5' y='92.23641223641224' height='21.811701811701813' width='107.7263' fill='rgb(147%2c 195%2c 223)'/%3e%3crect x='402.5' y='69.42678942678943' height='21.811701811701813' width='69.47593125' fill='rgb(194%2c 218%2c 237)'/%3e%3crect x='402.5' y='46.61716661716662' height='21.811701811701813' width='35.2155375' fill='rgb(221%2c 235%2c 247)'/%3e%3crect x='402.5' y='23.80754380754381' height='21.811701811701813' width='9.743525' fill='rgb(240%2c 247%2c 253)'/%3e%3crect x='402.5' y='0.9979209979209998' height='21.811701811701813' width='0.7305375000000001' fill='rgb(247%2c 251%2c 255)'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

const metadata = {
  name: 'Paired Bar Chart',
  id: 'rawgraphs.barchartpaired',
  thumbnail: img,
  icon: img$1,
  categories: ['Correlations', 'Comparison'],
  description: 'A bar chart with which compares two categories of one entity depending on a second variable.',
  code: 'https://github.com/rawgraphs/rawgraphs-paired-barchart',
  tutorial: 'https://github.com/rawgraphs/rawgraphs-paired-barchart#tutorial'
};

const dimensions = [{
  id: 'x1',
  name: 'Left Side',
  validTypes: ['number'],
  required: true
}, {
  id: 'x2',
  name: 'Right Side',
  validTypes: ['number'],
  required: true
}, {
  id: 'y',
  name: 'Y axis',
  validTypes: ['number', 'string', 'date'],
  required: true
}];

const mapData = {
  x1: 'get',
  x2: 'get',
  y: 'get'
};

function render(node, data, visualOptions, mapping, originalData, styles) {
  // destructurate visual visualOptions
  const {
    //artboard
    background,
    width,
    height,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    //axis
    axisLeftLabel,
    axisLeftLabelVisible,
    axisRightLabel,
    axisRightLabelVisible,
    axisVerticalLabel,
    axisVerticalLabelVisible,
    labelLeftAlignment,
    labelLeftRotation,
    labelRightAlignment,
    labelRightRotation,
    //chart
    spaceCommonAxis,
    sortBarsBy,
    padding,
    colorScale1,
    colorScale2
  } = visualOptions;
  const {
    minTitleHeight,
    titleSize,
    boundWidth,
    boundWidthOneChart,
    boundHeight,
    boundLeft,
    boundTop,
    x1Accessor,
    x2Accessor,
    yAccessor,
    barsSortings,
    barsDomain
  } = calcProps();
  const svg = select$1(node);
  const bounds = createBounds();
  const {
    x1Scale,
    x2Scale,
    x1ScaleReverse,
    yScale
  } = createScales();
  const {
    x1Axis,
    x2Axis,
    yAxis
  } = createAxes();
  createAxisLabels();
  createBars();
  function calcProps() {
    const minTitleHeight = 0;
    const titleSize = 0;
    let boundWidth = width - marginLeft - marginRight;
    let boundWidthOneChart = boundWidth - spaceCommonAxis;
    let boundHeight = height - marginTop - marginBottom;
    let boundLeft = marginLeft;
    let boundTop = boundHeight >= minTitleHeight ? marginTop + titleSize : marginTop;
    if (boundHeight >= minTitleHeight) {
      boundHeight -= titleSize;
    }
    const x1Accessor = d => d.x1;
    const x2Accessor = d => d.x2;
    const yAccessor = d => d.y;
    const barsSortings = {
      totalDescending: (a, b) => descending(a[1], b[1]),
      totalAscending: (a, b) => ascending(a[1], b[1]),
      name: (a, b) => ascending(a[0], b[0]),
      original: (a, b) => true
    };
    const barsDomain = rollups(data, v => sum(v, d => d.size), d => d.y).sort(barsSortings[sortBarsBy]).map(d => d[0]);
    return {
      minTitleHeight,
      titleSize,
      boundWidth,
      boundWidthOneChart,
      boundHeight,
      boundLeft,
      boundTop,
      x1Accessor,
      x2Accessor,
      yAccessor,
      barsSortings,
      barsDomain
    };
  }
  function createBounds() {
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', background);
    return svg.append('g').attr('transform', `translate(
      ${boundLeft},
      ${boundTop})`);
  }
  function createScales() {
    const x1Scale = scaleLinear().domain(extent(data, x1Accessor)).range([0, boundWidthOneChart / 2]).nice();
    const x1ScaleReverse = scaleLinear().domain(extent(data, x1Accessor)).range([boundWidth, (boundWidth + spaceCommonAxis) / 2]).nice();
    const x2Scale = scaleLinear().domain(extent(data, x2Accessor)).range([0, boundWidthOneChart / 2]).nice();
    const yScale = scaleBand().domain(barsDomain).range([0, boundHeight]).padding(padding / (boundHeight / barsDomain.length));
    return {
      x1Scale,
      x2Scale,
      x1ScaleReverse,
      yScale
    };
  }
  function createAxes() {
    const yAxisGenerator = axisLeft().scale(yScale);
    const yAxis = bounds.append('g').call(yAxisGenerator).attr('text-anchor', 'left');
    yAxis.attr('transform', `translate(${boundWidth / 2}, 0)`);
    yAxis.select('path').remove();
    yAxis.selectAll('line').remove();
    yAxis.selectAll('text').attr('dx', '0').attr('x', '0').attr('text-anchor', 'middle');
    const x1AxisGenerator = axisBottom().scale(x1ScaleReverse);
    const x1Axis = bounds.append('g').call(x1AxisGenerator).attr('transform', `translate(${-(boundWidth + spaceCommonAxis) / 2}, ${boundHeight})`);
    x1Axis.selectAll('text').attr('text-anchor', labelLeftAlignment).attr('transform', `rotate(${labelLeftRotation})`);
    const x2AxisGenerator = axisBottom().scale(x2Scale);
    const x2Axis = bounds.append('g').call(x2AxisGenerator).attr('transform', `translate(${(boundWidth + spaceCommonAxis) / 2}, ${boundHeight})`);
    x2Axis.selectAll('text').attr('text-anchor', labelRightAlignment).attr('transform', `rotate(${labelRightRotation})`);
    return {
      x1Axis,
      x2Axis,
      yAxis
    };
  }
  function createAxisLabels() {
    let labelX1 = null;
    let labelX2 = null;
    let labelY = null;
    if (axisLeftLabelVisible) {
      const {
        x: x1
      } = x1Axis._groups[0][0].getBBox();
      labelX1 = x1Axis.append('text').text(axisLeftLabel ? axisLeftLabel : mapping.x1.value).attr('dx', x1).attr('class', 'axisLabel'); //instead of .styles(styles.axisLabel)

      labelX1.attr('transform', `translate(${labelX1._groups[0][0].getBBox().width / 2}, ${-5})`);
    }
    if (axisRightLabelVisible) {
      const {
        x: x2,
        width: widthX2
      } = x2Axis._groups[0][0].getBBox();
      labelX2 = x2Axis.append('text').text(axisRightLabel ? axisRightLabel : mapping.x2.value).attr('dx', x2 + widthX2).attr('class', 'axisLabel'); //instead of .styles(styles.axisLabel)

      labelX2.attr('transform', `translate(${-labelX2._groups[0][0].getBBox().width / 2}, -5)`);
    }
    if (axisVerticalLabelVisible) {
      labelY = yAxis.append('text').text(axisVerticalLabel ? axisVerticalLabel : mapping.y.value).attr('class', 'axisLabel'); //instead of .styles(styles.axisLabel)

      labelY.attr('transform', `translate(${-labelY._groups[0][0].getBBox().width / 2}, 0)`);
    }
    return {
      labelX1,
      labelX2,
      labelY
    };
  }
  function createBars() {
    const bars1 = bounds.append('g').attr('id', 'bars1').selectAll('rect').data(data).join('rect').attr('x', d => boundWidthOneChart / 2 - x1Scale(x1Accessor(d))).attr('y', d => yScale(yAccessor(d))).attr('height', yScale.bandwidth()).attr('width', d => x1Scale(x1Accessor(d)))
    //.attr('fill', "#3333ff")
    .attr('fill', d => colorScale1(d.x1));
    const bars2 = bounds.append('g').attr('id', 'bars2').selectAll('rect').data(data).join('rect').attr('x', (boundWidth + spaceCommonAxis) / 2).attr('y', d => yScale(yAccessor(d))).attr('height', yScale.bandwidth()).attr('width', d => x2Scale(x2Accessor(d)))
    //.attr('fill', "#ff5555")
    .attr('fill', d => colorScale2(d.x2));
    return {
      bars1,
      bars2
    };
  }
}

const visualOptions = {
  //axis
  labelLeftRotation: {
    type: 'number',
    label: 'Left tick label rotation',
    default: -45,
    group: 'axis'
  },
  labelLeftAlignment: {
    type: 'text',
    label: 'Align left tick labels to:',
    group: 'axis',
    options: [{
      label: 'Left',
      value: 'start'
    }, {
      label: 'Middle',
      value: 'middle'
    }, {
      label: 'Right',
      value: 'end'
    }],
    default: 'end'
  },
  labelRightRotation: {
    type: 'number',
    label: 'Right tick label rotation',
    default: -45,
    group: 'axis'
  },
  labelRightAlignment: {
    type: 'text',
    label: 'Align right tick labels to:',
    group: 'axis',
    options: [{
      label: 'Left',
      value: 'start'
    }, {
      label: 'Middle',
      value: 'middle'
    }, {
      label: 'Right',
      value: 'end'
    }],
    default: 'end'
  },
  axisLeftLabel: {
    type: 'text',
    label: 'Left label override',
    default: '',
    group: 'axis'
  },
  axisLeftLabelVisible: {
    type: 'boolean',
    label: 'Left label visible',
    default: true,
    group: 'axis'
  },
  axisRightLabel: {
    type: 'text',
    label: 'Right label override',
    default: '',
    group: 'axis'
  },
  axisRightLabelVisible: {
    type: 'boolean',
    label: 'Right label visible',
    default: true,
    group: 'axis'
  },
  axisVerticalLabel: {
    type: 'text',
    label: 'Vertical label override',
    default: '',
    group: 'axis'
  },
  axisVerticalLabelVisible: {
    type: 'boolean',
    label: 'Vertical label visible',
    default: true,
    group: 'axis'
  },
  marginTop: {
    type: 'number',
    label: 'Margin (top)',
    default: 50,
    group: 'artboard'
  },
  marginRight: {
    type: 'number',
    label: 'Margin (right)',
    default: 50,
    group: 'artboard'
  },
  marginBottom: {
    type: 'number',
    label: 'Margin (bottom)',
    default: 50,
    group: 'artboard'
  },
  marginLeft: {
    type: 'number',
    label: 'Margin (left)',
    default: 50,
    group: 'artboard'
  },
  //chart
  spaceCommonAxis: {
    type: 'number',
    label: 'Space for common axis',
    default: 100,
    group: 'chart'
  },
  padding: {
    type: 'number',
    label: 'Padding Bars',
    default: 1,
    group: 'chart'
  },
  sortBarsBy: {
    type: 'text',
    label: 'Sort bars by',
    group: 'chart',
    options: [{
      label: 'Size (descending)',
      value: 'totalDescending'
    }, {
      label: 'Size (ascending)',
      value: 'totalAscending'
    }, {
      label: 'Name',
      value: 'name'
    }, {
      label: 'Original',
      value: 'original'
    }],
    default: 'original'
  },
  colorScale1: {
    type: 'colorScale',
    label: 'Color left axis',
    dimension: 'x1',
    default: {
      scaleType: 'sequential',
      interpolator: 'interpolateReds'
    },
    group: 'color'
  },
  colorScale2: {
    type: 'colorScale',
    label: 'Color right axis',
    dimension: 'x2',
    default: {
      scaleType: 'sequential',
      interpolator: 'interpolateBlues'
    },
    group: 'color'
  }
};

var styles = {"axisLabel":{"fontFamily":"Arial, sans-serif","fontSize":"12px","fill":"#7b7b7b","fontWeight":"bold"},"axisLine":{"stroke":"#ccc"},"labelPrimary":{"fontFamily":"Arial, sans-serif","fontSize":"10px","fill":"black","fontWeight":"bold"},"labelSecondary":{"fontFamily":"Arial, sans-serif","fontSize":"10px","fill":"black","fontWeight":"normal"},"labelItalic":{"fontFamily":"Arial, sans-serif","fontSize":"10px","fill":"black","fontWeight":"normal","fontStyle":"italic"},"seriesLabel":{"fontFamily":"Arial, sans-serif","fontSize":"12px","fill":"black","fontWeight":"bold","dominantBaseline":"hanging"},"labelOutline":{"strokeWidth":"2px","paintOrder":"stroke","stroke":"white","strokeLinecap":"round","strokeLinejoin":"round"}};

var barchartpaired = {
  metadata,
  dimensions,
  mapData,
  render,
  visualOptions,
  styles
};

export { barchartpaired, connectedscatterplot, polarareadiagram, similaritymap };
