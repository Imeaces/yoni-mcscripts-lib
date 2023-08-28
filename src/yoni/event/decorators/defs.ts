type ClassDecorator0 = <TFunction extends Function>(target: TFunction) => TFunction | void;
type PropertyDecorator0 = (target: Object, propertyKey: string | symbol) => void;
type MethodDecorator0 = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
type ParameterDecorator0 = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
