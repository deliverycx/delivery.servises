import { CreateMessage } from "./interface";

export function generateMessage(body: CreateMessage.IRecivedBody): string {
	let result = ``;

	result += `Заказ: \n`;
	body.items.forEach((el) => {
		result += `${el.name} x${el.amount}\n`;
	});

	result += `\n\n`;
	result += `Данные о пользователе: \n`;
	result += `Тип доставки: ${body.orderType} ${body.orderTypeName === 'ONSPOT' ? `(За столом) № ${body.ONSPOTTable} ` : ''} \n`;
	result += `Адрес: ${body.orderType === 'PICKUP' ? ' ' : body.address}\n`;
	result += `Телефон: ${body.phone}\n`;
	result += `Имя: ${body.name}\n`;
	result += `Комментарий: ${body.comment} \n`;
	result += `Данные о заказе: \n`;
	result += `дата - ${body.orderdata} \n`;
	result += `сумма - ${body.orderamount} `;
	result += `номер заказа - ${body.ordernumber} / id - ${body.orderid} \n`;
	result += (body.deliveryParam && (body.deliveryParam.timedelivery || body.deliveryParam.customermoneu || body.deliveryParam.devises)) && `время доставки - ${body.deliveryParam.timedelivery}, сдача - ${body.deliveryParam.customermoneu}, приборы - ${body.deliveryParam.devises}  \n`;


	return result;
}

export function messageReserveTable(body: CreateMessage.ImessageReserveTable): string {
	let result = ``;

	result += `\n\n`;
	result += `Заказ столика: \n`;
	result += `Имя: ${body.fullname} \n`;
	result += `Телефон: ${body.phone}\n`;
	result += `Дата: ${body.date}\n`;
	result += `Время: ${body.time}\n`;
	result += `Кол персон: ${body.person}`;

	return result;
}
export function messageCreatePayment(body: CreateMessage.ImessagePaymentOrder): string {
	let result = ``;

	result += `\n\n`;
	result += `Оплата заказа: \n`;
	result += `Статус заказа: ${body.statusOrder}\n`;
	result += `Имя: ${body.invoice.params.name}\n`;
	result += `Телефон: ${body.invoice.params.phone}\n`;
	result += `Дата: ${body.invoice.params.date}\n`;
	result += `Сумма: ${body.amount.value}\n`;
	result += `номер платежа: ${body.id}\n`;
	result += `id магазина: ${body.merchantId}\n`;
	result += `Статус оплаты: ${body.status === 'Authorized' ? 'Холдирование(деньги на удержании)' : ''} ${body.status === 'Settled' ? 'Подтвержден(деньги списали)' : ''}  \n`;


	return result;
}


export function messageReturnPayment(body: CreateMessage.ImessageRetuntPayment): string {
	let result = ``;

	result += `\n\n`;
	result += `Возврат полаты: \n`;
	result += `номер возврата: ${body.id}\n`;
	result += `номер платежа: ${body.paymentId}\n`;
	result += `статус возврата: ${body.status === 'Success' ? 'Выполнено' : 'Не известно'}\n`;
	result += `сумма возврата: ${body.amount.value}\n`;


	return result;
}

export function canselPayment(body: CreateMessage.ImessageRetuntPayment): string {
	let result = ``;

	result += `\n\n`;
	result += `Возврат оплаты: \n`;
	result += `номер платежа: ${body.paymentId}\n`;
	result += `статус возврата: 'Выполнено'\n`;



	return result;
}


export function unloadWebMenu(): string {
	let result = ``;

	result += `\n\n`;
	result += `Обновление меню iikkoWeb \n`;



	return result;
}