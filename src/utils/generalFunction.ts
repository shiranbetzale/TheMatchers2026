import qs from 'qs';
import { Linking } from 'react-native';

export const calculateAge = (date: Date) => {
    var today = new Date();
    var birthDate = new Date(date);
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
    }
    return age_now;
}

export const getDateBefore = (years: number) => {
    let eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - years);
    return eighteenYearsAgo;
}

export const groupBy = (array: any, key: string) => {
    return array.reduce((result: any, formField: any) => {
        const collapseTitle = formField[key];
        const { ...rest } = formField;
        const existingGroup = result.find((group: any) => group.title === collapseTitle);

        if (existingGroup) {
            existingGroup.data.push(rest);
        } else {
            result.push({
                title: collapseTitle,
                data: [rest],
            });
        }
        return result;
    }, []);
}

export const sendEmail = async (to = "", subject = "", body = "", options = {}) => {
    // const { cc = "", bcc = "" } = options;

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
        subject: subject,
        body: body,
        // cc: cc,
        // bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
}
