interface IMenu {
    label:string,
    icon: string,
    link: string,
}

export const items = ref<IMenu[]>([
    {
        label: 'Главная',
        icon: 'pi pi-home',
        link: '/'
    },
    {
        label: 'Общий счетчик',
        icon: 'pi pi-star',
        link: '/total-counter'
    },
        {
        label: 'Список',
        icon: 'pi pi-star',
        link: '/all-readings'
    },
]);