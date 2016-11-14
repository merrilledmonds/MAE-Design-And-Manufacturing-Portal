$(document).ready(function(){
	$("#button-reimbursement-request").click(function(){
		downloadReimbursementRequestForm();
	});
	$("#button-special-part-order").click(function(){
		downloadSpecializedOrderForm();
	});
	var url = document.location.toString();
	if ( url.match('#') ) {
		requestedForm=url.split("#")[1].toLowerCase();
		$('#form-'+requestedForm).addClass('in');
	}
});


function getFormInput(id,parent_element){
	parent_element = (typeof parent_element != "undefined")?parent_element:$("html");
	element = parent_element.find("#"+id).val();
	if(typeof element == "undefined"){
		element = parent_element.find("."+id).val();
	}
	return element;
}
function populateParts(){
	Parts = [];
	$(".items-list-line").each(function(){
		lineObject = {Vendor:getFormInput("item-vendor-input",$(this)), SKU:getFormInput("item-sku-input",$(this)), Quantity:getFormInput("item-quantity-input",$(this)), Price:getFormInput("item-price-input",$(this)), Description:getFormInput("item-link-input",$(this))};
		Parts.push(lineObject)
	});
	return Parts;
}

function downloadSpecializedOrderFormPDF(){
	settings={
		lmargin: 0.75,
		rmargin: 0.75,
		tmargin: 0.75,
		bmargin: 1.75,
		width: 8.5,
		height: 11};
	topGroupInfo = 1.5;
	centralDividerThickness = 0.15;
	leftGroupInfo = settings.lmargin;
	rightGroupInfo = settings.width/2-centralDividerThickness/2;
	topRecipientInfo = topGroupInfo;
	leftRecipientInfo = settings.width/2+centralDividerThickness/2;
	rightRecipientInfo = settings.width-settings.rmargin;
	topDisclaimer = topGroupInfo+1.5;
	topRecipientSignature = topDisclaimer+0.9;
	topAdvisorSignature = topRecipientSignature;
	
	groupInfoLabels = ["Group Number","Project Name","Advisor","Group Leader","Leader Email"];
	groupInfoValues = [orderInfo.groupNumber, orderInfo.projectName, orderInfo.advisor, orderInfo.leaderName, orderInfo.leaderEmail];
	recipientInfoLabels = ["FO Name","FO Email","Recipient Name","Recipient Email","Recipient Phone#"];
	recipientInfoValues = [orderInfo.financialOfficerName, orderInfo.financialOfficerEmail, orderInfo.recipientName, orderInfo.recipientEmail, orderInfo.recipientPhone];

	doc = new jsPDF('p','in',[settings.height,settings.width]);
	doc.addFont("Calibri","Calibri","normal");
	doc.setFont("Helvetica");
	doc.setFontStyle("normal");
	
	//Title
	doc.setFontSize(14);
	doc.centeredText("RUTGERS MAE 467: DESIGN AND MANUFACTURING I",settings.tmargin+0.5);
	
	//Scarlet Band
	doc.setFillColor(204,0,51);
	doc.rect(settings.lmargin,settings.tmargin+0.6,settings.width-settings.lmargin-settings.rmargin,0.3,"F");
	doc.setFontSize(11);
	doc.setTextColor(255);
	doc.centeredText("Fall 2016 Senior Design Specialized Part Order Form",settings.tmargin+0.8)
	
	//Generator
	doc.setFontSize(8);
	doc.setTextColor(0);
	date = new Date();
	doc.centeredText("Generated "+date.toUTCString()+" through the Design and Manufacturing Portal.",settings.tmargin+1.2);
	doc.setFontSize(11);
	
	//Group Info
	heightGroupInfoTitle = 0.3;
	doc.setFillColor(100);
	doc.rect(leftGroupInfo,settings.tmargin+0+topGroupInfo,rightGroupInfo-leftGroupInfo,heightGroupInfoTitle,"F");
	doc.setFontSize(9);
	doc.setTextColor(255);
	doc.text("GROUP INFORMATION",leftGroupInfo+0.1,settings.tmargin+0.2+topGroupInfo);
	
	//Group Info Labels
	marginGroupInfoLabels = 0.2;
	heightGroupInfoLabels = 0.2;
	for(i=0;i<groupInfoLabels.length;i++){
		if(i%2==0){
			doc.setFillColor(220);
		}else{
			doc.setFillColor(245);
		}
		doc.rect(leftGroupInfo,settings.tmargin+heightGroupInfoLabels*(i)+heightGroupInfoTitle+topGroupInfo,rightGroupInfo-leftGroupInfo,heightGroupInfoLabels,"F");
		doc.setFontSize(9);
		doc.setTextColor(0);
		lineBottomHeight=settings.tmargin+heightGroupInfoLabels*(i)+heightGroupInfoTitle+0.15+topGroupInfo;
		doc.rightAlignedText(groupInfoLabels[i],lineBottomHeight,leftGroupInfo+settings.lmargin+marginGroupInfoLabels);
		doc.text(groupInfoValues[i],leftGroupInfo+settings.lmargin+marginGroupInfoLabels+0.1,lineBottomHeight);
	}
	
	//Recipient Info
	heightRecipientInfoTitle = 0.3;
	doc.setFillColor(100);
	doc.rect(leftRecipientInfo,settings.tmargin+0+topRecipientInfo,rightRecipientInfo-leftRecipientInfo,heightRecipientInfoTitle,"F");
	doc.setFontSize(9);
	doc.setTextColor(255);
	doc.text("FO/RECIPIENT INFORMATION",leftRecipientInfo+0.1,settings.tmargin+0.2+topRecipientInfo);
	
	//Recipient Info Labels
	marginRecipientInfoLabels = 0.35;
	heightRecipientInfoLabels = 0.2;
	for(i=0;i<recipientInfoLabels.length;i++){
		if(i%2==0){
			doc.setFillColor(220);
		}else{
			doc.setFillColor(245);
		}
		doc.rect(leftRecipientInfo,settings.tmargin+heightRecipientInfoLabels*(i)+heightRecipientInfoTitle+topRecipientInfo,rightRecipientInfo-leftRecipientInfo,heightRecipientInfoLabels,"F");
		doc.setFontSize(9);
		doc.setTextColor(0);
		lineBottomHeight = settings.tmargin+heightRecipientInfoLabels*(i)+heightRecipientInfoTitle+0.15+topRecipientInfo;
		doc.rightAlignedText(recipientInfoLabels[i],lineBottomHeight,leftRecipientInfo+settings.lmargin+marginRecipientInfoLabels);
		doc.text(recipientInfoValues[i],leftRecipientInfo+settings.lmargin+marginRecipientInfoLabels+0.1,lineBottomHeight);
	}
	
	//Disclaimer
	disclaimerText = "By placing an order, the group members and their advisor accept and agree to the vendors' terms and conditions. Please note that prices listed are often wholesale, do not include shipping, handling fees, taxes, and/or duties, and are subject to correction or change without notice. TAs reserve the right to postpone orders that risk going over the group's budget until any issues can be sorted out. The named recipient hereby agrees to pick up any orders in a timely fashion, under penalty of having the items returned.";
	heightDisclaimer = 0.3;
	marginDisclaimer = 0.5;
	doc.setFontSize(9);
	doc.setTextColor(0);
	doc.text(doc.splitTextToSize(disclaimerText,settings.width-settings.lmargin-settings.rmargin-marginDisclaimer*2),settings.lmargin+marginDisclaimer,settings.tmargin+0.2+topDisclaimer);
	
	//Recipient Signature
	heightRecipientSignature = 1;
	marginRecipientSignature = 0.2
	doc.setFillColor(230);
	doc.rect(leftGroupInfo,settings.tmargin+0+topRecipientSignature,rightGroupInfo-leftGroupInfo+centralDividerThickness,heightRecipientSignature,"F");
	doc.setFontSize(9);
	doc.setTextColor(0);
	doc.text("Recipient Signature",settings.lmargin+marginRecipientSignature,settings.tmargin+0.2+topRecipientSignature+heightRecipientSignature-0.3);
	
	//Advisor Signature
	heightAdvisorSignature = 1;
	marginAdvisorSignature = 0.2
	bottomAdvisorSignature = topAdvisorSignature + heightAdvisorSignature;
	doc.setFillColor(230);
	doc.rect(leftRecipientInfo-centralDividerThickness,settings.tmargin+0+topAdvisorSignature,rightRecipientInfo-leftRecipientInfo+centralDividerThickness,heightAdvisorSignature,"F");
	doc.setFontSize(9);
	doc.setTextColor(0);
	doc.rightAlignedText("Advisor Signature",settings.tmargin+0.2+topAdvisorSignature+heightAdvisorSignature-0.3,settings.width-settings.rmargin-marginAdvisorSignature);
	signatureLineHeight = settings.tmargin+topAdvisorSignature+heightAdvisorSignature-0.3;
	doc.setLineWidth(0.01);
	doc.line(leftGroupInfo+0.1,signatureLineHeight,rightGroupInfo-0.1,signatureLineHeight);
	doc.line(leftRecipientInfo+0.1,signatureLineHeight,rightRecipientInfo-0.1,signatureLineHeight);
	
	//Divider
	// marginDivider = -2;
	// dashSizeDivider = 0.05;
	// doc.setDrawColor(0);
	// doc.setLineWidth(0.01);
	// doc.dashedLine(settings.lmargin+marginDivider, settings.tmargin+bottomAdvisorSignature+0.2, settings.width-settings.rmargin-marginDivider, settings.tmargin+bottomAdvisorSignature+0.2,dashSizeDivider);
	
	//ITEMS LIST
	maxBottom = settings.height-settings.bmargin;
	pageCount = 1;
	topItemsList = bottomAdvisorSignature + 0.4;
	leftVendor = 0.2;
	leftSKU = 1.5;
	leftQuantity = 2.4;
	leftPrice = 3.0;
	leftDescription = 3.8;
	//Items List Header, First Page
	heightListHeader = 0.3;
	heightLine = 0.2;
	heightText = 0.15;
	doc.setFillColor(100);
	doc.rect(settings.lmargin,settings.tmargin+0+topItemsList,settings.width-settings.lmargin-settings.rmargin,heightListHeader,"F");
	doc.setFontSize(9);
	doc.setTextColor(255);
	doc.text("Vendor",settings.lmargin+leftVendor,settings.tmargin+0.2+topItemsList);
	doc.text("Item/SKU#",settings.lmargin+leftSKU,settings.tmargin+0.2+topItemsList);
	doc.text("Quantity",settings.lmargin+leftQuantity,settings.tmargin+0.2+topItemsList);
	doc.text("Unit Price",settings.lmargin+leftPrice,settings.tmargin+0.2+topItemsList);
	doc.text("Item URL",settings.lmargin+leftDescription,settings.tmargin+0.2+topItemsList);
	topItemsList += heightListHeader;
	
	//Admin Use Footer, First Page
	insertFooter = function(){	
		dashSizeAdminUse = 0.05;
		marginAdminUseLine = 0.2;
		textLineBottom = settings.height-settings.bmargin+heightLine+0.2;
		doc.setLineWidth(0.01);
		doc.dashedLine(settings.lmargin+marginAdminUseLine,settings.height-settings.bmargin+0.2,settings.width-settings.rmargin-marginAdminUseLine,settings.height-settings.bmargin+0.2,dashSizeAdminUse)
		doc.setTextColor(150);
		doc.setFillColor(255);
		centerRectHeight = 0.2;
		centerRectWidth = 1.5;
		doc.rect((settings.width-centerRectWidth)/2,settings.height-settings.bmargin+0.2-centerRectHeight/2,centerRectWidth,centerRectHeight,"F");
		doc.centeredText("Official Use Only",settings.height-settings.bmargin+0.2+heightText/4);
		if(orderInfo.Urgent){
			doc.setTextColor(255);
			doc.setFillColor(125,0,0);
			doc.rect(settings.lmargin,settings.height-settings.bmargin+0.4,1,0.5,"F");
			doc.text("URGENT",settings.lmargin+0.25,settings.height-settings.bmargin+0.7);
		}
		if(pageCount==1){
			doc.setTextColor(0);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+1.05-0.9,settings.height-settings.bmargin+0.4,1,0.5,"D");
			doc.text("Sub",settings.lmargin+1.1-0.9,settings.height-settings.bmargin+0.7);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+2.1-0.9,settings.height-settings.bmargin+0.4,1,0.5,"D");
			doc.text("Ap/V",settings.lmargin+2.15-0.9,settings.height-settings.bmargin+0.7);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+3.15-0.9,settings.height-settings.bmargin+0.4,1,0.5,"D");
			doc.text("PO",settings.lmargin+3.2-0.9,settings.height-settings.bmargin+0.7);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+4.2-0.9,settings.height-settings.bmargin+0.4,1,0.5,"D");
			doc.text("R/Req",settings.lmargin+4.25-0.9,settings.height-settings.bmargin+0.7);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+5.25-0.9,settings.height-settings.bmargin+0.4,1,0.5,"D");
			doc.text("Void",settings.lmargin+5.3-0.9,settings.height-settings.bmargin+0.7);
			doc.setFontSize(14);
			doc.setTextColor(100,0,0);
			doc.text("Order Total:",settings.lmargin+5.5,settings.height-settings.bmargin+0.575)
			doc.text("$"+getTotal(),settings.lmargin+5.5,settings.height-settings.bmargin+0.825)
			doc.setFontSize(9);
			doc.setTextColor(0);
		}else{
			doc.setFontSize(8);
			doc.setTextColor(0);
			doc.text("B",settings.lmargin+2,settings.height-settings.bmargin+0.7);
			doc.text("C",settings.lmargin+3.25,settings.height-settings.bmargin+0.7);
			doc.text("D",settings.lmargin+4.5,settings.height-settings.bmargin+0.7);
			doc.text("VOID",settings.lmargin+5.75,settings.height-settings.bmargin+0.7);
		}
	};
	insertFooter();
	
	
	//Items List Lines
	for(i=0;i<Parts.length;i++){
		item = Parts[i];
		Log("Part "+i+" ("+(i+1)+" of "+(Parts.length)+"): "+item.Description);
		
		Log("    Determining description height for Part "+i+".");
		description = (item.Description!="")?item.Description:"No Description";
		splitLine = doc.splitTextToSize(description,settings.width-settings.rmargin-settings.lmargin-leftDescription-0.2);
		minTextHeight = heightText*(splitLine.length-1);
		minHeight = heightLine + minTextHeight;
		
		Log("    Determining if page spills over because of Part "+i+".");
		Log("        Part "+i+" starts at "+(topItemsList+settings.tmargin).toFixed(2)+" and will take up approx "+minHeight.toFixed(2)+"in, thus ending at "+(settings.tmargin+topItemsList+minHeight).toFixed(2)+".");
		Log("        Footer starts at "+maxBottom.toFixed(2)+".");
		//Pagebreak if we're going to go over the bottom
		if((settings.tmargin+topItemsList+minHeight)>maxBottom){
			Log("        Part "+i+" exceeds page height. Creating new page.");
			doc.addPage();
			pageCount++;
			topItemsList = heightLine;
			
			Log("            Creating new header above box for Part "+i+".");
			//Page Header, Subsequent Pages
			Log("                Determining header text above Part "+i+".");
			headerTextLeft = (new Date()).toUTCString();
			headerTextCenter = " ";
			headerTextRight = [orderInfo.groupNumber,orderInfo.leaderNetID,orderInfo.recipientNetID,Parts.length,"-","p"+pageCount].join("/");
			doc.text(headerTextLeft,settings.lmargin,settings.tmargin+topItemsList-heightText);
			doc.centeredText(headerTextCenter, settings.tmargin+topItemsList-heightText);
			doc.rightAlignedText(headerTextRight,settings.tmargin+topItemsList-heightText,settings.width-settings.rmargin);
			//Items List Header, Subsequent Pages
			doc.setFillColor(100);
			doc.rect(settings.lmargin,settings.tmargin+0+topItemsList,settings.width-settings.lmargin-settings.rmargin,heightListHeader,"F");
			doc.setFontSize(9);
			doc.setTextColor(255);
			doc.text("Vendor",settings.lmargin+leftVendor,settings.tmargin+0.2+topItemsList);
			doc.text("Item/SKU#",settings.lmargin+leftSKU,settings.tmargin+0.2+topItemsList);
			doc.text("Quantity",settings.lmargin+leftQuantity,settings.tmargin+0.2+topItemsList);
			doc.text("Unit Price",settings.lmargin+leftPrice,settings.tmargin+0.2+topItemsList);
			doc.text("Short Description",settings.lmargin+leftDescription,settings.tmargin+0.2+topItemsList);
			topItemsList += heightListHeader;
			//Admin Use Footer, Subsequent Pages
			insertFooter();
		}
		
		Log("    Determining bgColor for Part "+i+".");
		if(i%2==0){
			doc.setFillColor(210);
		}else{
			doc.setFillColor(250);
		}
		Log("    Drawing bg for Part "+i+".");
		doc.setTextColor(0);
		doc.setFontSize(8);
		doc.rect(settings.lmargin,settings.tmargin+0+topItemsList,settings.width-settings.lmargin-settings.rmargin,minHeight,"F");
		Log("    Determining y positions for Part "+i+".");
		rowTop = settings.tmargin+topItemsList;
		textFirstLineBottom = rowTop+heightLine/2+heightText/3;
		/*
		doc.setFillColor(250,0,0);
		doc.rect(settings.lmargin,rowTop,settings.width-settings.lmargin-settings.rmargin,heightLine,"F");
		doc.setFillColor(150,0,0);
		doc.rect(settings.lmargin,textFirstLineBottom,settings.width-settings.lmargin-settings.rmargin,heightText,"F");
		*/
		Log("    Writing text for Part "+i+".");
		doc.text(item.Vendor,settings.lmargin+leftVendor,textFirstLineBottom);
		doc.text(item.SKU,settings.lmargin+leftSKU,textFirstLineBottom);
		doc.text(""+Math.floor(parseFloat(item.Quantity)),settings.lmargin+leftQuantity,textFirstLineBottom);
		doc.text("$"+parseFloat(item.Price).toFixed(2),settings.lmargin+leftPrice,textFirstLineBottom);
		doc.text(splitLine,settings.lmargin+leftDescription,textFirstLineBottom);
		
		Log("    Determining bottom position for Part "+i+".");
		topItemsList += minHeight;
		
		Log("    Finished processing Part "+i+". Moving to next item.");
	};
	
	//doc.output("dataurlnewwindow");
	doc.save(""+orderInfo.groupNumber +"_s"+ Math.floor(Date.now()/100/60/60/24) +".pdf")
};
function downloadSpecializedOrderFormCSV(){
	csvContent = "data:text/csv;charset=utf-8,";
	csvContent += "Group Number,"+orderInfo.groupNumber+",,,\n";
	csvContent += "Project Name,"+orderInfo.projectName+",,,\n";
	csvContent += "Advisor,"+orderInfo.advisor+",,,\n";
	csvContent += "Leader Name,"+orderInfo.leaderName+",,,\n";
	csvContent += "Leader NetID,"+orderInfo.leaderNetID+",,,\n";
	csvContent += "Leader Email,"+orderInfo.leaderEmail+",,,\n";
	csvContent += "Financial Officer Name,"+orderInfo.financialOfficerName+",,,\n";
	csvContent += "Financial Officer NetID,"+orderInfo.financialOfficerNetID+",,,\n";
	csvContent += "Financial Officer Email,"+orderInfo.financialOfficerEmail+",,,\n";
	csvContent += "Recipient Name,"+orderInfo.recipientName+",,,\n";
	csvContent += "Recipient NetID,"+orderInfo.recipientNetID+",,,\n";
	csvContent += "Recipient Email,"+orderInfo.recipientEmail+",,,\n";
	csvContent += "Recipient Phone,"+orderInfo.recipientPhone+",,,\n";
	csvContent += "Vendor,SKU,Quantity,Unit Price,Item URL\n";
	for(i=0;i<Parts.length;i++){
		part = Parts[i];
		dataString = part.Vendor+","+part.SKU+","+part.Quantity+","+parseFloat(part.Price).toFixed(2)+","+part.Description.split(",").join(";");
		csvContent += dataString+"\n";
	}
	encodedUri = encodeURI(csvContent);
	link = document.createElement("a");
	link.setAttribute("href",encodedUri);
	link.setAttribute("download",""+orderInfo.groupNumber+"_s"+Math.floor(Date.now()/100/60/60/24)+".csv");
	document.body.appendChild(link);
	link.click();
}
function downloadSpecializedOrderForm(){
	orderInfo={
		groupNumber: $("#settings-group-number").val(),
		projectName: $("#settings-project-name").val(),
		advisor: $("#settings-advisor").val(),
		leaderName: $("#settings-leader-name").val(),
		leaderNetID: $("#settings-leader-netid").val(),
		leaderEmail: $("#settings-leader-email").val(),
		financialOfficerName: $("#settings-financial-officer-name").val(),
		financialOfficerNetID: $("#settings-financial-officer-netid").val(),
		financialOfficerEmail: $("#settings-financial-officer-email").val(),
		recipientName: $("#special-part-order-recipient-name").val(),
		recipientNetID: $("#special-part-order-recipient-netid").val(),
		recipientEmail: $("#special-part-order-recipient-email").val(),
		recipientPhone: $("#special-part-order-recipient-phone").val(),
	};
	populateParts();
	downloadSpecializedOrderFormCSV()
	downloadSpecializedOrderFormPDF()
}

function downloadReimbursementRequestForm(){
	orderInfo={
		groupNumber: $("#settings-group-number").val(),
		projectName: $("#settings-project-name").val(),
		advisor: $("#settings-advisor").val(),
		leaderName: $("#settings-leader-name").val(),
		leaderNetID: $("#settings-leader-netid").val(),
		leaderEmail: $("#settings-leader-email").val(),
		financialOfficerName: $("#settings-financial-officer-name").val(),
		financialOfficerNetID: $("#settings-financial-officer-netid").val(),
		financialOfficerEmail: $("#settings-financial-officer-email").val(),
		approvedBuyer: $("#reimbursement-request-approved-buyer").val(),
		approvedPaymentMethod: $("#reimbursement-request-approved-payment-method").val(),
		shippingAddress: "N/A",
		payroll: $("#reimbursement-request-payroll").val(),
		notPayroll: $("#reimbursement-request-not-payroll").val(),
		partName: $("#reimbursement-request-part-name").val(),
		SKU: $("#reimbursement-request-sku").val(),
		vendor: $("#reimbursement-request-vendor").val(),
		vendorWebsite: $("#reimbursement-request-vendor-website").val(),
		vendorIsManufacturer: $("#reimbursement-request-vendor-is-manufacturer").val(),
		linkToPart: $("#reimbursement-request-link-to-part").val(),
		price: $("#reimbursement-request-price").val(),
		quantity: $("#reimbursement-request-quantity").val(),
		category: $("#reimbursement-request-category").val(),
		itemUse: $("#reimbursement-request-item-use").val(),
		otherPartsConsidered: $("#reimbursement-request-other-parts-considered").val(),
		justification: $("#reimbursement-request-justification").val(),
		declarationAmazon: $("#reimbursement-request-declaration-amazon").is(":checked"),
		declarationMcMaster: $("#reimbursement-request-declaration-mcmaster").is(":checked"),
		declarationApprovedVendors: $("#reimbursement-request-declaration-approved-vendors").is(":checked"),
		declarationAvoid: $("#reimbursement-request-declaration-avoid").is(":checked"),
		declarationSpecializedOrderForm: $("#reimbursement-request-declaration-specialized-order-form").is(":checked"),
		declarationApproval: $("#reimbursement-request-declaration-approval").is(":checked"),
		declarationW9: $("#reimbursement-request-declaration-w9").is(":checked")
	};
	if($("#reimbursement-request-shipping-address").is(":checked")){
		orderInfo.shippingAddress=[orderInfo.approvedBuyer+" c/o MAE Senior Design","98 Brett Road, Piscataway, NJ 08854"];
	}else{
		orderInfo.shippingAddress=["SHIPPING ADDRESS NOT ACKNOWLEDGED.","REQUEST WILL BE DENIED."];
	}

	settings={
		lmargin: 0.75,
		rmargin: 0.75,
		tmargin: 0.75,
		bmargin: 1.5,
		width: 8.5,
		height: 11};
	topGroupInfo = 1;
	centralDividerThickness = 0.15;
	leftGroupInfo = settings.lmargin;
	rightGroupInfo = settings.width/2-centralDividerThickness/2;
	topFinancialOfficerInfo = topGroupInfo;
	leftFinancialOfficerInfo = settings.width/2+centralDividerThickness/2;
	rightFinancialOfficerInfo = settings.width-settings.rmargin;
	topFinancialOfficerSignature = topGroupInfo+1.6	;
	topAdvisorSignature = topFinancialOfficerSignature;
	
	groupInfoLabels = ["Group Number","Project Name","Advisor","Group Leader","Leader NetID","Leader Email"];
	groupInfoValues = [orderInfo.groupNumber, orderInfo.projectName, orderInfo.advisor, orderInfo.leaderName, orderInfo.leaderNetID, orderInfo.leaderEmail];
	financialOfficerInfoLabels = ["FO Name","FO NetID","FO Email"];
	financialOfficerInfoValues = [orderInfo.financialOfficerName, orderInfo.financialOfficerNetID, orderInfo.financialOfficerEmail];

	doc = new jsPDF('p','in',[settings.height,settings.width]);
	doc.addFont("Calibri","Calibri","normal");
	doc.setFont("Helvetica");
	doc.setFontStyle("normal");
	
	//Title
	doc.setFontSize(14);
	doc.centeredText("RUTGERS MAE 467: DESIGN AND MANUFACTURING I",settings.tmargin+0.5);
	
	//Scarlet Band
	doc.setFillColor(204,0,51);
	doc.rect(settings.lmargin,settings.tmargin+0.6,settings.width-settings.lmargin-settings.rmargin,0.3,"F");
	doc.setFontSize(11);
	doc.setTextColor(255);
	doc.centeredText("Fall 2016 Senior Design Request for Reimbursement Approval",settings.tmargin+0.8)
	
	//Group Info
	heightGroupInfoTitle = 0.3;
	doc.setFillColor(100);
	doc.rect(leftGroupInfo,settings.tmargin+0+topGroupInfo,rightGroupInfo-leftGroupInfo,heightGroupInfoTitle,"F");
	doc.setFontSize(9);
	doc.setTextColor(255);
	doc.text("GROUP INFORMATION",leftGroupInfo+0.1,settings.tmargin+0.2+topGroupInfo);
	
	//Group Info Labels
	marginGroupInfoLabels = 0.2;
	heightGroupInfoLabels = 0.2;
	for(i=0;i<groupInfoLabels.length;i++){
		if(i%2==0){
			doc.setFillColor(220);
		}else{
			doc.setFillColor(245);
		}
		doc.rect(leftGroupInfo,settings.tmargin+heightGroupInfoLabels*(i)+heightGroupInfoTitle+topGroupInfo,rightGroupInfo-leftGroupInfo,heightGroupInfoLabels,"F");
		doc.setFontSize(9);
		doc.setTextColor(0);
		lineBottomHeight=settings.tmargin+heightGroupInfoLabels*(i)+heightGroupInfoTitle+0.15+topGroupInfo;
		doc.rightAlignedText(groupInfoLabels[i],lineBottomHeight,leftGroupInfo+settings.lmargin+marginGroupInfoLabels);
		doc.text(groupInfoValues[i],leftGroupInfo+settings.lmargin+marginGroupInfoLabels+0.1,lineBottomHeight);
	}
	
	//Financial Officer Info
	heightFinancialOfficerInfoTitle = 0.3;
	doc.setFillColor(100);
	doc.rect(leftFinancialOfficerInfo,settings.tmargin+0+topFinancialOfficerInfo,rightFinancialOfficerInfo-leftFinancialOfficerInfo,heightFinancialOfficerInfoTitle,"F");
	doc.setFontSize(9);
	doc.setTextColor(255);
	doc.text("FINANCIAL OFFICER INFORMATION",leftFinancialOfficerInfo+0.1,settings.tmargin+0.2+topFinancialOfficerInfo);
	
	//Financial Officer Info Labels
	marginFinancialOfficerInfoLabels = 0.15;
	heightFinancialOfficerInfoLabels = 0.2;
	for(i=0;i<financialOfficerInfoLabels.length;i++){
		if(i%2==0){
			doc.setFillColor(220);
		}else{
			doc.setFillColor(245);
		}
		doc.rect(leftFinancialOfficerInfo,settings.tmargin+heightFinancialOfficerInfoLabels*(i)+heightFinancialOfficerInfoTitle+topFinancialOfficerInfo,rightFinancialOfficerInfo-leftFinancialOfficerInfo,heightFinancialOfficerInfoLabels,"F");
		doc.setFontSize(9);
		doc.setTextColor(0);
		lineBottomHeight = settings.tmargin+heightFinancialOfficerInfoLabels*(i)+heightFinancialOfficerInfoTitle+0.15+topFinancialOfficerInfo;
		doc.rightAlignedText(financialOfficerInfoLabels[i],lineBottomHeight,leftFinancialOfficerInfo+settings.lmargin+marginFinancialOfficerInfoLabels);
		doc.text(financialOfficerInfoValues[i],leftFinancialOfficerInfo+settings.lmargin+marginFinancialOfficerInfoLabels+0.1,lineBottomHeight);
	}
	
	doc.text("Declarations",settings.lmargin+leftFinancialOfficerInfo-0.5,lineBottomHeight+0.25);
	declarationText = "Amazon:";
	if(orderInfo.declarationAmazon){declarationText+="Yes, ";}else{declarationText+="No, ";}
	declarationText += "McMaster:";
	if(orderInfo.declarationMcMaster){declarationText+="Yes, ";}else{declarationText+="No, ";}
	declarationText += "ApprovedVendors: ";
	if(orderInfo.declarationApprovedVendors){declarationText+="Yes, ";}else{declarationText+="No, ";}
	declarationText += "Avoid:";
	if(orderInfo.declarationAvoid){declarationText+="Yes, ";}else{declarationText+="No, ";}
	declarationText += "SpecialOrderForm:";
	if(orderInfo.declarationSpecializedOrderForm){declarationText+="Yes, ";}else{declarationText+="No, ";}
	declarationText += "Approval:";
	if(orderInfo.declarationApproval){declarationText+="Yes";}else{declarationText+="No";}
	splitDeclarations=doc.splitTextToSize(declarationText,3);
	doc.text(splitDeclarations,settings.lmargin+leftFinancialOfficerInfo-0.5,lineBottomHeight+0.4);
	
	//Approved Buyer Signature
	heightFinancialOfficerSignature = 1;
	marginFinancialOfficerSignature = 0.2
	doc.setFillColor(230);
	doc.rect(leftGroupInfo,settings.tmargin+0+topFinancialOfficerSignature,rightGroupInfo-leftGroupInfo+centralDividerThickness,heightFinancialOfficerSignature,"F");
	doc.setFontSize(9);
	doc.setTextColor(0);
	approvedBuyerInfo=["Approved Buyer Details","Name: "+orderInfo.approvedBuyer,"Payment Method: "+orderInfo.approvedPaymentMethod,"Shipping Address:"];
	approvedBuyerInfo=approvedBuyerInfo.concat(orderInfo.shippingAddress);
	doc.text(approvedBuyerInfo,settings.lmargin+marginFinancialOfficerSignature,settings.tmargin+0.2+topFinancialOfficerSignature);
	
	//Advisor Signature
	heightAdvisorSignature = 1;
	marginAdvisorSignature = 0.2
	bottomAdvisorSignature = topAdvisorSignature + heightAdvisorSignature;
	doc.setFillColor(230);
	doc.rect(leftFinancialOfficerInfo-centralDividerThickness,settings.tmargin+0+topAdvisorSignature,rightFinancialOfficerInfo-leftFinancialOfficerInfo+centralDividerThickness,heightAdvisorSignature,"F");
	doc.setFontSize(9);
	doc.setTextColor(0);
	doc.rightAlignedText("Approved Buyer Signature",settings.tmargin+0.2+topAdvisorSignature+heightAdvisorSignature-0.3,settings.width-settings.rmargin-marginAdvisorSignature);
	signatureLineHeight = settings.tmargin+topAdvisorSignature+heightAdvisorSignature-0.3;
	doc.setLineWidth(0.01);
	doc.line(leftFinancialOfficerInfo+0.1,signatureLineHeight,rightFinancialOfficerInfo-0.1,signatureLineHeight);
	
	
	heightLine=0.17;
	heightText=0.15;
	pageCount=1;
	
	//Admin Use Footer, First Page
	insertFooter = function(){	
		dashSizeAdminUse = 0.05;
		marginAdminUseLine = 0.2;
		textLineBottom = settings.height-settings.bmargin+heightLine+0.2;
		doc.setLineWidth(0.01);
		doc.dashedLine(settings.lmargin+marginAdminUseLine,settings.height-settings.bmargin+0.2,settings.width-settings.rmargin-marginAdminUseLine,settings.height-settings.bmargin+0.2,dashSizeAdminUse)
		doc.setTextColor(150);
		doc.setFillColor(255);
		centerRectHeight = 0.2;
		centerRectWidth = 1.5;
		doc.rect((settings.width-centerRectWidth)/2,settings.height-settings.bmargin+0.2-centerRectHeight/2,centerRectWidth,centerRectHeight,"F");
		doc.centeredText("Official Use Only",settings.height-settings.bmargin+0.2+heightText/4);
		if(pageCount==1){
			doc.setTextColor(0);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+0.5,settings.height-settings.bmargin+0.35,2,0.25,"D");
			doc.text("Approved",settings.lmargin+0.55,settings.height-settings.bmargin+0.525);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+2.5,settings.height-settings.bmargin+0.35,2,0.25,"D");
			doc.text("Denied",settings.lmargin+2.55,settings.height-settings.bmargin+0.525);
			doc.setLineWidth(0.01);
			doc.rect(settings.lmargin+4.5,settings.height-settings.bmargin+0.35,2,0.25,"D");
			doc.text("Void",settings.lmargin+4.55,settings.height-settings.bmargin+0.525);
			doc.setFontSize(9);
			doc.setTextColor(0);
			if(orderInfo.declarationW9){
				doc.text("Attachments: "+orderInfo.approvedBuyer+"-W9",settings.lmargin+0.3,settings.height-settings.bmargin+0.75);
			}
		}else{
			// doc.setFontSize(8);
			// doc.setTextColor(0);
			// doc.text("B",settings.lmargin+2,settings.height-settings.bmargin+0.7);
			// doc.text("C",settings.lmargin+3.25,settings.height-settings.bmargin+0.7);
			// doc.text("D",settings.lmargin+4.5,settings.height-settings.bmargin+0.7);
			// doc.text("VOID",settings.lmargin+5.75,settings.height-settings.bmargin+0.7);
		}
	};
	insertFooter();
	
	
	doc.setFontSize(8);
	heightLine=0.15;
	heightText=0.13;
	
	
	marginDetails = 1;
	currentItemTop = settings.tmargin+topAdvisorSignature+heightAdvisorSignature+0.1;
	currentItemTop += heightLine;
	doc.text("Group Members on Payroll",settings.lmargin+marginDetails,currentItemTop);
	doc.text("Group Members not on Payroll",settings.lmargin+marginDetails+settings.width/3,currentItemTop);
	currentItemTop += heightLine;
	payrollLines = orderInfo.payroll.split("\n");
	notPayrollLines = orderInfo.notPayroll.split("\n");
	doc.text(payrollLines,settings.lmargin+marginDetails+0.2,currentItemTop);
	doc.text(notPayrollLines,settings.lmargin+marginDetails+0.2+settings.width/3,currentItemTop);
	currentItemTop += (Math.max(payrollLines.length,notPayrollLines.length))*heightLine;
	
	detailCenterMargin = 2
	detailLabels = ["Part Name","SKU#","Vendor","Vendor Site","Is Vendor the Manufacturer?","Link to Part","Price","Quantity Requested","Item Category"];
	detailContent = [orderInfo.partName, orderInfo.SKU, orderInfo.vendor, orderInfo.vendorWebsite, orderInfo.vendorIsManufacturer, orderInfo.linkToPart, orderInfo.price, orderInfo.quantity, orderInfo.category];
	for(detail_index=0; detail_index<detailContent.length; detail_index++){
		doc.rightAlignedText(detailLabels[detail_index],currentItemTop,settings.lmargin+detailCenterMargin);
		doc.text(detailContent[detail_index],settings.lmargin+detailCenterMargin+0.2,currentItemTop);
		currentItemTop += heightLine;
	}
	currentItemTop+=heightLine;
	
	justificationMargin=0.3;
	itemUseText = doc.splitTextToSize(orderInfo.itemUse,settings.width-settings.lmargin-settings.rmargin-justificationMargin);
	otherPartsConsideredText = doc.splitTextToSize(orderInfo.otherPartsConsidered,settings.width-settings.lmargin-settings.rmargin-justificationMargin);
	justificationText = doc.splitTextToSize(orderInfo.justification,settings.width-settings.lmargin-settings.rmargin-justificationMargin);
	pageCount = 1;
	addPageBreak=function(){
		doc.addPage();
		doc.text("Continued from Page "+pageCount+".",settings.lmargin,settings.tmargin+0.2);
		currentItemTop = settings.tmargin+0.5;
		pageCount++;
	};
	doc.text("How the item will be used in the project:",settings.lmargin+justificationMargin-0.2,currentItemTop);
	currentItemTop+=heightLine;
	for(itemUseText_index=0; itemUseText_index<itemUseText.length; itemUseText_index++){
		if(currentItemTop+heightLine>(settings.height-settings.bmargin)){
			addPageBreak();
		}
		doc.text(itemUseText[itemUseText_index],settings.lmargin+justificationMargin,currentItemTop);
		currentItemTop += heightLine;
	}
	doc.text("Other parts/options considered for stated use:",settings.lmargin+justificationMargin-0.2,currentItemTop);
	currentItemTop+=heightLine*1.5;
	for(otherPartsConsideredText_index=0; otherPartsConsideredText_index<otherPartsConsideredText.length; otherPartsConsideredText_index++){
		if(currentItemTop+heightLine>(settings.height-settings.bmargin)){
			addPageBreak();
		}
		doc.text(otherPartsConsideredText[otherPartsConsideredText_index],settings.lmargin+justificationMargin,currentItemTop);
		currentItemTop += heightLine;
	}
	doc.text("All reasons for choosing selection over competitors:",settings.lmargin+justificationMargin-0.2,currentItemTop);
	currentItemTop+=heightLine*1.5;
	for(justificationText_index=0; justificationText_index<justificationText.length; justificationText_index++){
		if(currentItemTop+heightLine>(settings.height-settings.bmargin)){
			addPageBreak();
		}
		doc.text(justificationText[justificationText_index],settings.lmargin+justificationMargin,currentItemTop);
		currentItemTop += heightLine;
	}
	
	
	
	//doc.output("dataurlnewwindow");
	doc.save(""+orderInfo.groupNumber +"_"+ Math.floor(Date.now()/100/60/60/24) +".pdf")
	
}